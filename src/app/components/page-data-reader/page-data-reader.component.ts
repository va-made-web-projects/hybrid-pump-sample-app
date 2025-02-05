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

  constructor(public pageDataService: PageDataService) {}

  async ngOnInit() {
    await this.readPageData();

    this.groupedData = this.groupDataBySecond(this.allPagesData);
  }

  async readPageData() {
    console.log('Reading page data');
    try {
      // Read current page number
      this.currentPage = await this.pageDataService.readCurrentPage();

      // Read all pages from 0 to current page
      this.allPagesData = await this.pageDataService.readAllPages();
      // const data = await this.pageDataService.readMultiplePages(0, this.currentPage!, 10);
      // const data = await this.pageDataService.readAllFlashData();
      this.pagesDataSignal.set(this.allPagesData);
      console.log('FLASH data', this.allPagesData);
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
