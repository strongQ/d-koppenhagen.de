import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { ScullyRoute, ScullyRoutesService } from '@scullyio/ng-lib';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'dk-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss'],
})
export class PreviewComponent implements OnInit, OnChanges {
  @Input() content: string;
  @Input() max: number;
  @Input() keyword: string;
  @Input() search: string;
  postData$: Observable<ScullyRoute[]>;
  cntAll: number;

  constructor(private srs: ScullyRoutesService) {}

  ngOnInit() {
    this.loadPosts();
  }

  ngOnChanges() {
    this.loadPosts();
  }

  private loadPosts() {
    this.postData$ = this.srs.available$.pipe(
      map((routeList) => {
        return routeList
          .filter((route: ScullyRoute) =>
            route.route.startsWith(`/${this.content}/`),
          )
          .filter((route: ScullyRoute) => route.published !== false)
          .reverse();
      }),
      tap((routeList) => (this.cntAll = routeList.length)),
      map((routeList) => {
        if (!this.keyword) {
          return routeList;
        }
        return routeList.filter((route: ScullyRoute) =>
          route.keywords.includes(this.keyword),
        );
      }),
      map((routeList) => {
        if (!this.search) {
          return routeList;
        }
        return routeList.filter((route: ScullyRoute) => {
          const searchTerm = this.search.toLowerCase();
          return (
            route.keywords.includes(this.search) ||
            route.title.toLowerCase().includes(searchTerm) ||
            route.description.toLowerCase().includes(searchTerm) ||
            route.author.toLowerCase().includes(searchTerm)
          );
        });
      }),
      map((routeList) => {
        if (this.max) {
          routeList = routeList.slice(0, this.max);
        }
        return routeList;
      }),
    );
  }
}
