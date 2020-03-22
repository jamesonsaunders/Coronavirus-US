import { Component } from '@angular/core';
import { UsMapService } from '../services/us-map.service';
import {HttpParams, HttpClient, HttpHeaders} from "@angular/common/http";
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  fillStateColors = {};
  maxRecovered = 0;
  maxConfirmed = 0;
  maxDeaths = 0;
  metric = 'confirmed';
  stats = [];
  lastUpdated = null;

  constructor(
    private usMap: UsMapService,
    private httpClient: HttpClient,
    private alertCtrl: AlertController,
  ) {
    this.loadData();

    this.usMap.getUsMapCoordinates().then(coords => {
      coords.forEach(c => {
        this.fillStateColors[c.id] = '#eee';
      });
    });
  }

  loadData() {
    this.httpClient.get(`https://covid-19-coronavirus-statistics.p.rapidapi.com/v1/stats`, {
      headers: new HttpHeaders({
        "x-rapidapi-host": "covid-19-coronavirus-statistics.p.rapidapi.com",
        "x-rapidapi-key": "5d9c0334cfmshb59099cc3b2ef9bp186f10jsn78fb264f2415",
      }),
      params: new HttpParams().set("country", "us"),
    }).toPromise().then((results: any) => {
      console.log(results);
      this.stats = results.data.covid19Stats;
      this.lastUpdated = new Date(results.data.lastChecked);


      this.stats.forEach(stat => {
        // console.log(stat);
        if (stat.confirmed > this.maxConfirmed)
          this.maxConfirmed = stat.confirmed;
        if (stat.recovered > this.maxRecovered)
          this.maxRecovered = stat.recovered;
        if (stat.deaths > this.maxDeaths)
          this.maxDeaths = stat.deaths;
      });

      console.log(`maxConfirmed: ${this.maxConfirmed}`);
      console.log(`maxRecovered: ${this.maxRecovered}`);
      console.log(`maxDeaths: ${this.maxDeaths}`);

      this.computeColors();
    });
  }

  metricChanged(metric) {
    console.log(metric);
    this.metric = metric;
    this.computeColors();
  }

  computeColors() {
    this.stats.forEach(stat => {
      let state = this.usMap.states.find(s => s.name === stat.province);
      if (!state)
        return;

      if (this.metric === 'confirmed') {
        let alpha = (stat.confirmed / this.maxConfirmed);
        this.fillStateColors[state.abbreviation] = `rgba(255, 0, 0, ${alpha})`;
      }
      else if (this.metric === 'recovered') {
        let alpha = (stat.recovered / this.maxRecovered);
        this.fillStateColors[state.abbreviation] = `rgba(0, 255, 0, ${alpha})`;
        console.log(`${state.abbreviation}: ${stat.recovered}/${this.maxRecovered} = ${stat.recovered / this.maxRecovered}`);
      }
      else if (this.metric === 'deaths') {
        let alpha = (stat.deaths / this.maxDeaths);
        this.fillStateColors[state.abbreviation] = `rgba(255, 0, 255, ${alpha})`;
      }
    });
  }

  onMapClick(abbreviation) {
    console.log(abbreviation);
    let state = this.usMap.states.find(state => state.abbreviation === abbreviation['state-abbr']);
    this.presentAlert(this.stats.find(stat => stat.province === state.name));
  }

  async presentAlert(stat) {
    const alert = await this.alertCtrl.create({
      header: stat.province,
      subHeader: `Last updated: ${new Date(stat.lastUpdate).toLocaleDateString()}`,
      message: `Confirmed: ${stat.confirmed}<br>
Recovered: ${stat.recovered}<br>
Deaths: ${stat.deaths}`,
      buttons: ['OK']
    });

    await alert.present();
  }
}
