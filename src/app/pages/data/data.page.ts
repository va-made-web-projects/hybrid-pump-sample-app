import { PageDataService } from 'src/app/services/page-data.service';
import { Component, OnInit } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { BluetoothDataService } from 'src/app/services/bluetooth-data.service';

@Component({
  selector: 'app-data',
  templateUrl: './data.page.html',
  styleUrls: ['./data.page.scss'],
})
export class DataPage implements OnInit {
  // spoof a random that will be replaced by the real data
  data : { date: string, value: number }[] = [];
  groupedData: Record<string, { date: string; value: number; }[]> = {};
  isDownloading: boolean = false;
  constructor(public pageDataService: PageDataService, public bluetoothDataService: BluetoothDataService) {
   }

  ngOnInit() {
    // this.groupedData = this.groupDataByMinute(this.data);
    // console.log(this.groupedData);
  }

  async downloadPageData() {
    this.isDownloading = true;
    console.log('Reading page data');
    try {
      // Read current page number
      const currentPage = await this.pageDataService.readCurrentPage();

      // Read all pages from 0 to current page
      const allPagesData = await this.pageDataService.readAllPages().finally(() => {
        this.isDownloading = false;
      });

    } catch (error) {
      console.error('Error reading page data:', error);
    }
  }

  async download() {
    await this.downloadPageData()
    // Ask the user where to save the file
    const saveLocation = await this.promptSaveLocation();

    if (!saveLocation) {
      console.log('Save location not specified by user.');
      return;
    }

    const filename = `pump_data-${new Date().getTime()}.csv`;

    // Adjust the directory based on user choice
    const directory = saveLocation === 'documents' ? Directory.Documents : Directory.Cache;

    this.saveCSV(this.pageDataService.allPageData(), filename, directory);
  }

  async promptSaveLocation(): Promise<string | null> {
    // Simulate a simple choice prompt for now
    const saveOptions = [
      { value: 'documents', label: 'Documents' },
      { value: 'cache', label: 'Cache' },
    ];

    const userChoice = window.confirm('Save to Documents? Click Cancel for Cache.');
    return userChoice ? 'documents' : 'cache';
  }

  async saveCSV(data: any[], fileName: string, directory: Directory): Promise<void> {
    const csvContent = this.convertToCSV(data);

    try {
      if (Capacitor.isNativePlatform()) {
        const result = await Filesystem.writeFile({
          path: fileName,
          data: csvContent,
          directory: directory,
          encoding: Encoding.UTF8,
        });
        console.log('File saved at:', result.uri);
      } else {
        this.downloadCSVWeb(csvContent, fileName); // Web fallback
      }
    } catch (error) {
      console.error('Error saving file:', error);
    }
  }

  private downloadCSVWeb(csvContent: string, fileName: string): void {
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  groupDataByMinute(data: { date: string, value: number }[]): Record<string, { date: string, value: number }[]> {
    const groupedData: Record<string, { date: string, value: number }[]> = {};

    data.forEach((entry) => {
      const date = new Date(entry.date);
      const minuteKey = date.toISOString().substring(0, 16) + ':00.000'; // Key in the format "YYYY-MM-DD HH:mm:00.000"

      if (!groupedData[minuteKey]) {
        groupedData[minuteKey] = [];
      }

      groupedData[minuteKey].push(entry);
    });

    return groupedData;
  }

  // download() {
  //   //set filename to a unique UUID with timestamp to prevent overwriting
  //   // make uuid

  //   const filename = `pump_data-${new Date().getTime()}.csv`;

  //   this.saveCSV(this.data, filename);
  // }

  // downloadCSVWeb(csvContent: string, fileName: string): void {
  //   const blob = new Blob([csvContent], { type: 'text/csv' });
  //   const link = document.createElement('a');
  //   link.href = URL.createObjectURL(blob);
  //   link.download = fileName;
  //   link.click();
  //   URL.revokeObjectURL(link.href);
  // }

  // async saveCSV(data: any[], fileName: string): Promise<void> {
  //   const csvContent = this.convertToCSV(data);

  //   if (Capacitor.isNativePlatform()) {
  //     try {
  //       const result = await Filesystem.writeFile({
  //         path: fileName,
  //         data: csvContent,
  //         directory: Directory.Documents,
  //         encoding: Encoding.UTF8,
  //         recursive: true,
  //       });
  //       console.log('File saved at:', result.uri);
  //     } catch (error) {
  //       console.error('Error saving file:', error);
  //     }
  //   } else {
  //     this.downloadCSVWeb(csvContent, fileName); // Web fallback
  //   }
  // }

async writeFile(data : string, fileName: string) {
  const result = await Filesystem.writeFile({
    path: fileName,
    data: data,
    directory: Directory.Documents,
    encoding: Encoding.UTF8,
  });
};

async readSecretFile() {
  const contents = await Filesystem.readFile({
    path: 'secrets/text.txt',
    directory: Directory.Documents,
    encoding: Encoding.UTF8,
  });

  console.log('secrets:', contents);
};

  /**
   * Deletes the secret file at `secrets/text.txt` in the documents directory.
   *
   * @returns A promise that resolves when the file is deleted.
   */
async deleteSecretFile() {
  await Filesystem.deleteFile({
    path: 'secrets/text.txt',
    directory: Directory.Documents,
  });
};

convertToCSV(data: any[]): string {
  if (!data || !data.length) {
    return '';
  }

  const separator = ',';
  const keys = Object.keys(data[0]);
  const csvContent = [
    keys.join(separator), // Header row
    ...data.map(row => keys.map(key => row[key]).join(separator)) // Data rows
  ].join('\n');

  return csvContent;
}

}
