
export class Volunteer {
  id?: number;
  firstname: string;
  lastname: string;
  location: string;
  email: string;
  password?: string;
  created_at?: string;
  update_at?: string;

  constructor(data?: Partial<Volunteer>) {
    this.firstname = data?.firstname || '';
    this.lastname = data?.lastname || '';
    this.location = data?.location || '';
    this.email = data?.email || '';
    this.id = data?.id;
    this.password = data?.password;
    this.created_at = data?.created_at;
    this.update_at = data?.update_at;
  }

}
