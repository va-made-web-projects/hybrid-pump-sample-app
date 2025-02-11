import { Component, OnInit, signal } from '@angular/core';
import { PageDataService } from 'src/app/services/page-data.service';

interface PageData {
  pageNumber: number;
  data: number[];
}

interface SensorData {
  timestamp: number;
  sensorValue: number;
  isMotorRunning: boolean;
  pumpMode: number;
  batteryReading: number;
  lowThreshold: number;
  highThreshold: number;
}

@Component({
  selector: 'app-page-data-reader',
  templateUrl: './page-data-reader.component.html',
  styleUrls: ['./page-data-reader.component.scss'],
})
export class PageDataReaderComponent implements OnInit {
  currentPage: number | null = null;
  allPagesData: SensorData[] = [];
  groupedData: Record<string,SensorData[]> = {};

  pagesDataSignal = signal<SensorData[]>([]);
  first_page: SensorData[] = [];
  last_page: SensorData[] = [];

  constructor(public pageDataService: PageDataService) {}

  async ngOnInit() {
    await this.onReadPageData();

    this.groupedData = this.groupDataBySecond(this.allPagesData);
  }

  formatTime(page: number): string {
    return this.calculateRecordedTime(page);
  }

  calculateRecordedTime(currentPage: number): string {
    // Calculate total seconds
    const totalSeconds = currentPage * 16;

    // Convert to hours, minutes, seconds
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    // Format the output
    return `${hours}h ${minutes}m ${seconds}s`;
  }

  async onReadPageData() {
    console.log('Reading page data');
    try {
      // Read current page number
      this.currentPage = await this.pageDataService.readCurrentPage();

      // Read all pages from 0 to current page
      // this.allPagesData = await this.pageDataService.readAllPages();
      this.first_page = await this.pageDataService.readSinglePage(0) || [];
      let last_page_num = this.currentPage! - 1;
      if (last_page_num < 0) {
        last_page_num = 0;
      }
      this.last_page = await this.pageDataService.readSinglePage(last_page_num) || [];

      // const data = await this.pageDataService.readMultiplePages(0, this.currentPage!, 10);
      // const data = await this.pageDataService.readAllFlashData();
      // combine the first and last pages

      this.pagesDataSignal.set(this.first_page.concat(this.last_page));
      // this.pagesDataSignal.set(this.last_page);
      // this.allPagesData = this.pagesDataSignal();
    } catch (error) {
      console.error('Error reading page data:', error);
    }
  }

  groupDataBySecond(data: SensorData[]): Record<string, SensorData[]> {
    const groupedData: Record<string, SensorData[]> = {};

    data.forEach((entry) => {
      // Convert ms timestamp to seconds by truncating (integer division)
      const secondKey = Math.floor(entry.timestamp / 1000).toString();

      if (!groupedData[secondKey]) {
        groupedData[secondKey] = [];
      }

      groupedData[secondKey].push(entry);
    });

    return groupedData;
  }

}
