export interface CreateClassDTO {
  id?: string;
  title: string;
  description: string;
  date: Date;
  user_id: string;
}

export interface ClasseWebDTO {
  id: string;
  title: string;
  description: string;
  date: Date;
}
