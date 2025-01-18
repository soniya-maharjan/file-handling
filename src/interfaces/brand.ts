export interface IBrand {
  name: string;
  image: string;
  slug: string;
}

export interface IBrandResponse extends IBrand {
  _id: string;
  created_at: Date;
  updated_at: Date;
}
