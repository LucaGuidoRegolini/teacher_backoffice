import { CreateClassDTO } from '../dto/classe.dto';
import { Domain } from '@shared/domain';

export class Classe extends Domain {
  private _title: string;
  private _description: string;
  private _date: Date;
  private _user_id: string;

  constructor(data: CreateClassDTO) {
    super(data.id);
    this._title = data.title;
    this._description = data.description;
    this._date = data.date;
    this._user_id = data.user_id;
  }

  get title() {
    return this._title;
  }

  get description() {
    return this._description;
  }

  get date() {
    return this._date;
  }

  get user_id() {
    return this._user_id;
  }

  public setTitle(title: string) {
    this._title = title;
  }

  public setDescription(description: string) {
    this._description = description;
  }

  public setDate(date: Date) {
    this._date = date;
  }
}
