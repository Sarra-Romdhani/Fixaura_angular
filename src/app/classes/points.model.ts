export class Points {
  id: string;
  userId: string;
  points: number;
  createdAt: Date;

  constructor(id: string, userId: string, points: number, createdAt: Date) {
    this.id = id;
    this.userId = userId;
    this.points = points;
    this.createdAt = createdAt;
  }

  static fromJson(json: any): Points {
    return new Points(
      json._id?.toString() ?? json.id ?? 'unknown',
      json.userId?.toString() ?? 'unknown',
      parseInt(json.points) || 0,
      json.createdAt ? new Date(json.createdAt) : new Date()
    );
  }
}