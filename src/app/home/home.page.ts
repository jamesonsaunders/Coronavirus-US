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
  stats = {};
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
      let cityStats = results.data.covid19Stats;

      this.stats = {};
      cityStats.forEach(stat => {
        if (!this.stats[stat.province])
          this.stats[stat.province] = stat;
        else {
          this.stats[stat.province].confirmed += stat.confirmed;
          this.stats[stat.province].recovered += stat.recovered;
          this.stats[stat.province].deaths += stat.deaths;
        }
      });

      this.lastUpdated = new Date(results.data.lastChecked);

      this.usMap.states.forEach(state => {
        if (this.stats[state.name].confirmed > this.maxConfirmed)
          this.maxConfirmed = this.stats[state.name].confirmed;
        if (this.stats[state.name].recovered > this.maxRecovered)
          this.maxRecovered = this.stats[state.name].recovered;
        if (this.stats[state.name].deaths > this.maxDeaths)
          this.maxDeaths = this.stats[state.name].deaths;
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
    this.usMap.states.forEach(state => {
      if (!state)
        return;

      if (this.metric === 'confirmed') {
        let alpha = (this.stats[state.name].confirmed / this.maxConfirmed);
        this.fillStateColors[state.abbreviation] = alpha ? `rgba(255, 0, 0, ${alpha})` : 'white';
        // console.log(`${state.abbreviation}: ${this.stats[state.name].confirmed}/${this.maxConfirmed} = ${this.stats[state.name].confirmed / this.maxConfirmed}`);
      }
      else if (this.metric === 'recovered') {
        let alpha = (this.stats[state.name].recovered / this.maxRecovered);
        this.fillStateColors[state.abbreviation] = alpha ? `rgba(0, 255, 0, ${alpha})` : 'white';
        // console.log(`${state.abbreviation}: ${this.stats[state.name].recovered}/${this.maxRecovered} = ${this.stats[state.name].recovered / this.maxRecovered}`);
      }
      else if (this.metric === 'deaths') {
        let alpha = (this.stats[state.name].deaths / this.maxDeaths);
        this.fillStateColors[state.abbreviation] = alpha ? `rgba(255, 0, 255, ${alpha})` : 'white';
      }
    });
  }

  onMapClick(abbreviation) {
    console.log(abbreviation);
    let state = this.usMap.states.find(state => state.abbreviation === abbreviation['state-abbr']);
    this.presentAlert(this.stats[state.name]);
  }

  async presentAlert(stat) {
    console.log(stat);
    const alert = await this.alertCtrl.create({
      header: stat.province,
      subHeader: stat.lastUpdate,
      message: `Confirmed: ${stat.confirmed}<br>
Recovered: ${stat.recovered}<br>
Deaths: ${stat.deaths}`,
      buttons: ['OK']
    });

    await alert.present();
  }
}
