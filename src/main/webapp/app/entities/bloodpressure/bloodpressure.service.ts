import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IBloodpressure } from 'app/shared/model/bloodpressure.model';

type EntityResponseType = HttpResponse<IBloodpressure>;
type EntityArrayResponseType = HttpResponse<IBloodpressure[]>;

@Injectable({ providedIn: 'root' })
export class BloodpressureService {
  public resourceUrl = SERVER_API_URL + 'api/bloodpressures';
  public resourceSearchUrl = SERVER_API_URL + 'api/_search/bloodpressures';

  constructor(protected http: HttpClient) {}

  create(bloodpressure: IBloodpressure): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(bloodpressure);
    return this.http
      .post<IBloodpressure>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(bloodpressure: IBloodpressure): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(bloodpressure);
    return this.http
      .put<IBloodpressure>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IBloodpressure>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IBloodpressure[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IBloodpressure[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  protected convertDateFromClient(bloodpressure: IBloodpressure): IBloodpressure {
    const copy: IBloodpressure = Object.assign({}, bloodpressure, {
      timestamp: bloodpressure.timestamp != null && bloodpressure.timestamp.isValid() ? bloodpressure.timestamp.format(DATE_FORMAT) : null
    });
    return copy;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.timestamp = res.body.timestamp != null ? moment(res.body.timestamp) : null;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((bloodpressure: IBloodpressure) => {
        bloodpressure.timestamp = bloodpressure.timestamp != null ? moment(bloodpressure.timestamp) : null;
      });
    }
    return res;
  }
}
