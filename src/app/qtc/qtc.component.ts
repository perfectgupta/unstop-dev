import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-qtc',
  templateUrl: './qtc.component.html',
  styleUrls: ['./qtc.component.scss']
})
export class QtcComponent {
  textInput = '';
  apiResponse: any;
  showResponse = false;

  // Bar Chart data
  barChartOptions: any = {
    responsive: true,
  };
  barChartLabels: string[] = [];
  barChartType = 'bar';
  barChartLegend = true;
  barChartData: any[] = [];

  constructor(private http: HttpClient, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
  }

  submitRequest() {
    // Show loader
    this.spinner.show();

    // Make API request
    this.http.post<any>('https://mklobj224fnefrr6n77i5th5yi0vljdo.lambda-url.ap-south-1.on.aws/predict', {
      text: this.textInput,
      model: 11
    }).subscribe(response => {
      // Hide loader
      this.spinner.hide();

      // Display API response
      this.apiResponse = response;
      this.showResponse = true;

      // Prepare data for bar chart
      this.barChartLabels = response.predictions.map((prediction: { tag: any; }) => prediction.tag);
      this.barChartData = [
        {
          data: response.predictions.map((prediction: { probability: number; }) => prediction.probability * 100),
          label: 'Probabilities (%)'
        }
      ];
    });
  }
}
