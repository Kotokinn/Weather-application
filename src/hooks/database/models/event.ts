export class Event {

  private _id: number;
  private _date: string;
  private _title: string;
  private _description: string;

  /**
   * Getter id
   * @return {number}
   */
  public get id(): number {
    return this._id;
  }

  /**
   * Getter date
   * @return {string}
   */
  public get date(): string {
    return this._date;
  }

  /**
   * Getter title
   * @return {string}
   */
  public get title(): string {
    return this._title;
  }

  /**
   * Setter id
   * @param {number} value
   */
  public set id(value: number) {
    this._id = value;
  }

  /**
   * Setter date
   * @param {string} value
   */
  public set date(value: string) {
    this._date = value;
  }

  /**
   * Setter title
   * @param {string} value
   */
  public set title(value: string) {
    this._title = value;
  }
  /**
   * Getter description
   * @return {string}
   */
  public get description(): string {
    return this._description;
  }

  /**
   * Setter description
   * @param {string} value
   */

  public set description(value: string) {
    this._description = value;
  }



  getColumns() {
    return [
      { column: "id", type: "INTEGER" },
      { column: "date", type: "TEXT" },
      { column: "title", type: "TEXT" },
      { column: "description", type: "TEXT" },
    ];
  }

  toRecord() {
    return {
      id: this._id,
      type: this._date,
      name: this._title,
      description: this._description
    };
  }
}
