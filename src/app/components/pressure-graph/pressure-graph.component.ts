import { OnDestroy, ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartEvent, ChartType } from 'chart.js';
import { Subscription } from 'rxjs';
import { BluetoothService } from 'src/app/services/bluetooth.service';

@Component({
  selector: 'app-pressure-graph',
  templateUrl: './pressure-graph.component.html',
  styleUrls: ['./pressure-graph.component.scss'],
})
export class PressureGraphComponent  implements OnInit, OnDestroy {

  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  dataSub: Subscription = new Subscription;
  currentPressureReading: number = 0;

  lineChartType: ChartType = 'line';
  lineChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [],
        label: 'Pressure',
        backgroundColor: 'rgba(148,159,177,0.2)',
        borderColor: 'rgba(148,159,177,1)',
        pointBackgroundColor: 'rgba(148,159,177,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(148,159,177,0.8)',
        fill: 'origin',
      },
    ],
    labels: [],
  };

  options: any;
  constructor(private bluetoothService: BluetoothService) {
    Chart.register(...registerables);
  }
  ngOnDestroy(): void {
    if (this.dataSub) {
      this.dataSub.unsubscribe();
    }
  }

  ngOnInit() {
    this.options= {
      elements: {
        line: {
          tension: 0.5,
        },
      },
      scales: {
        // We use this empty structure as a placeholder for dynamic theming.
        y: {
          position: 'left',
          color: 'red',
        },
      },

    };

    this.dataSub = this.bluetoothService.notifyData.subscribe(
      data => {
        this.currentPressureReading = data
      }
    )

    let count = 0;
    setInterval(() => {
      // Generate a random number. Adjust the range as needed.
      // const randomNumber = Math.floor(Math.random() * 100);

      // Assuming you always want to add to the first dataset.
      if (this.lineChartData.datasets[0].data) {
        if (this.lineChartData.datasets[0].data.length >= 10) {
          // Remove the oldest element
          this.lineChartData.datasets[0].data.shift();
          this.lineChartData.labels?.shift();
        }
        this.lineChartData.datasets[0].data.push(this.currentPressureReading);
        this.lineChartData.labels?.push(count);
        count++
        if (this.chart && this.chart.chart && this.chart.chart.update) {
          this.chart.chart.update();
        }
      }
    }, 1000); // 1000 milliseconds = 1
  }

}


