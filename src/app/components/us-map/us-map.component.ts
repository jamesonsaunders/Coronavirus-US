import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UsMapService } from 'src/app/services/us-map.service';

@Component({
  selector: 'us-map',
  templateUrl: './us-map.component.html',
  styleUrls: ['./us-map.component.scss']
})
export class UsMapComponent implements OnInit {
  coordinates: object;
  @Input() fillColor: string = "#000";
  @Input() fillStateColors = {};
  @Input() strokeColor: string = "#000";
  @Output('onMapClick') click = new EventEmitter();

  constructor(private usMapService: UsMapService) { }

  ngOnInit() {
    this.usMapService.getUsMapCoordinates().then(data => this.coordinates = data);
  }

  onUsMapClick(state) {
    this.click.emit({ "state-abbr": state });
  }
}