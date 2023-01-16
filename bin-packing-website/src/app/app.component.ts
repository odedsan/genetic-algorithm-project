import { Component, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import * as Highcharts from 'highcharts';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';


interface responeDataModel{
  nextFitValue: number;
	nextFitRunningTime: number;
	firstFitValue: number;
	firstFitRunningTime: number;
	bestFitValue: number;
	bestFitRunningTime: number;
	firstFitDecValue: number;
	firstFitDecRunningTime: number;
	GAValue: number;
	GARunningTime: number;
}


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {

  constructor(private http: HttpClient,
    private readonly cdRef: ChangeDetectorRef) {
    this.changeQuery = new EventEmitter<string>();

  }
  title = 'bin-packing-website';

  public binpackingSize: number = -1;

  public isRandomBinSize: boolean = false;

  public isRandomNumOfObj = false;

  public isRandomNumOfGen = false;

  public binSizeInput: any; 

  private changeQuery: EventEmitter<string>;

  public weights: string = '';

  public binSize: string = '';

  public GARunningTime: string = '';


  highcharts = Highcharts;

  updateFlag = false;

  valueChartOptions : Highcharts.Options = {
    chart: {
      type: 'column'
    },
    title: {
      text: 'Comparison of the results of the algorithms'
    },
    xAxis: {
      categories: ["Next Fit", "First Fit","Best Fit", "First Fit Decreasing" ,"Genetic Algorithm"]
    },
    series: [
      {
        name: 'Number Of Bins',
        type: 'column',
        color: '#5F9EA0',
        data: [0, 0 ,0, 0, 0]
      }
    ],
  }

  runningTimeChartOptions : Highcharts.Options = {
    chart: {
      type: 'column',
    },
    title: {
      text: 'Comparison of the CPU running time of the algorithms'
    },
    yAxis: {
      title: {
        text: "time in miliseconds"
      }
    },
    xAxis: {
      categories: ["Next Fit", "First Fit","Best Fit", "First Fit Decreasing"]
    },
    series: [
      {
        name: 'Running Time Of Algorithm',
        type: 'column',
        color: '#7DF9FF',
        data: [0, 0 ,0, 0]
      }
    ],
  }
  
  onInputChange(event : any) {
    console.log(event);
    
  }

  binSizeRandom(event: any) {

    console.log(this.binSizeInput);
    if(event.value === '1')
      this.isRandomBinSize = false;
    if(event.value === '2')
      this.isRandomBinSize = true
  }

  binSizeValue(event: any){
    this.changeQuery.emit(event);
    console.log(this.changeQuery);
    
  }

  numbeOfObjectsRandom(event: any){
    if(event.value === '1')
      this.isRandomNumOfObj = false;
    if(event.value === '2')
      this.isRandomNumOfObj = true
  }

  numberOfGenerationsRandom(event: any){
    if(event.value === '1')
      this.isRandomNumOfGen = false;
    if(event.value === '2')
      this.isRandomNumOfGen = true
  }


  stringToResponseDataModel(res: any) {
    let nextFitRunningTimePos = res.indexOf('nextFitRunningTime');
    let firstFitValuePos = res.indexOf('firstFitValue');
    let firstFitRunningTimePos = res.indexOf('firstFitRunningTime');
    let bestFitValuePos = res.indexOf('bestFitValue');
    let bestFitRunningTimePos = res.indexOf('bestFitRunningTime');
    let firstFitDecValuePos = res.indexOf('firstFitDecValue');
    let firstFitDecRunningTimePos = res.indexOf('firstFitDecRunningTime');
    let GAValue = res.indexOf('GAValue');
    let GARunningTimePos = res.indexOf('GARunningTime');
    let weightsPos = res.indexOf('weights');
    console.log( Number(res.substring(GARunningTimePos+ 16, weightsPos - 3 )));
    console.log( res.substring(GARunningTimePos+ 16, weightsPos - 2 ));

    console.log(res)
    let output= {} as responeDataModel;
    output.nextFitValue = Number(res.substring(17, nextFitRunningTimePos - 3));
    output.nextFitRunningTime = Number(res.substring(nextFitRunningTimePos + 21, firstFitValuePos - 3 )) - 1;
    output.firstFitValue = Number(res.substring(firstFitValuePos+ 16, firstFitRunningTimePos - 3 ));
    output.firstFitRunningTime = Number(res.substring(firstFitRunningTimePos+ 22, bestFitValuePos - 3 )) - 1;
    output.bestFitValue = Number(res.substring(bestFitValuePos+ 15, bestFitRunningTimePos - 3 ));
    output.bestFitRunningTime = Number(res.substring(bestFitRunningTimePos+ 21, firstFitDecValuePos - 3 )) -1;
    output.firstFitDecValue = Number(res.substring(firstFitDecValuePos+ 19, firstFitDecRunningTimePos - 3 ))
    output.firstFitDecRunningTime = Number(res.substring(firstFitDecRunningTimePos+ 25, GAValue - 3 )) - 1;
    output.GAValue = Number(res.substring(GAValue+ 9, GARunningTimePos - 3 ));
    output.GARunningTime = Number(res.substring(GARunningTimePos+ 16, weightsPos - 3 ));
    this.weights = res.substring(weightsPos+ 10, res.length - 2 )
    this.GARunningTime = res.substring(GARunningTimePos+ 16, weightsPos - 3 );
    
    return output;
  }

  async onButtonClick() {
    let binSize = 0;
    let numberOfObj = 0;
    let numberOfGen = 0;
    if(this.isRandomBinSize)
      binSize = Math.floor(Math.random() * 100);
    else
      binSize = Number((<HTMLInputElement>document.getElementById("binSizeInputField")).value);
    if(this.isRandomNumOfObj)
      numberOfObj = Math.floor(Math.random() * 100);
    else
      numberOfObj = Number((<HTMLInputElement>document.getElementById("numberOfObjInputField")).value);
    if(this.isRandomNumOfGen)
      numberOfGen = Math.floor(Math.random() * 1000);
    else
      numberOfGen = Number((<HTMLInputElement>document.getElementById("numberOfGenInputField")).value);
    this.binSize = String(binSize);
    console.log(binSize, numberOfObj, numberOfGen)
    const body = {binSize: binSize, numberOfObj: numberOfObj , numberOfGenerations: numberOfGen}
    const options = { headers: {'Content-Type': 'application/json'}, responeType: 'json'}
    const res = await this.http.post<responeDataModel>("http://localhost:3000/run-python-script",body,options)
    .pipe(map( res => {
      let responeData: responeDataModel =  this.stringToResponseDataModel(res);
     console.log(responeData);

    this.valueChartOptions.series = [
      {
        name: 'Number Of Bins',
        type: 'column',
        data: [responeData.nextFitValue, responeData.firstFitValue ,responeData.bestFitValue, responeData.firstFitDecValue, responeData.GAValue]
      },
    ]

      this.runningTimeChartOptions.series = [
      {
        name: 'Running Time Of Algorithm',
        type: 'column',
        data: [responeData.nextFitRunningTime, responeData.firstFitRunningTime ,responeData.bestFitRunningTime, responeData.firstFitDecRunningTime]
      },
    ]

    this.updateFlag = true;
    this.cdRef.detectChanges();
      

    })).subscribe();
  }

}
