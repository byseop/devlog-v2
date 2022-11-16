declare interface DateResponse {
  start: string;
  end: string | null;
  time_zone: TimeZoneRequest | null;
}

declare interface SelectPropertyResponse {
  id: StringRequest;
  name: StringRequest;
  color: SelectColor;
}

declare type StringRequest = string;
declare type SelectColor =
  | 'default'
  | 'gray'
  | 'brown'
  | 'orange'
  | 'yellow'
  | 'green'
  | 'blue'
  | 'purple'
  | 'pink'
  | 'red';
declare type TextRequest = string;

declare type MultiSelectDatabasePropertyConfigResponse = {
  type: 'multi_select';
  multi_select: {
    options: Array<SelectPropertyResponse>;
  };
  id: string;
  name: string;
};
