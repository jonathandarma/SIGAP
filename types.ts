export type DataStatus = "live" | "simulated" | "stale" | "unavailable";

export type DataSourceMetadata = {
  status: DataStatus;
  source: string;
  observedAt: string;
  note: string;
};

export type Location = { id: string; name: string; region: string };
export type AirQualityReading = {
  locationId: string;
  aqi: number;
  category: "Baik" | "Sedang" | "Tidak Sehat" | "Sangat Tidak Sehat";
  pm25: number;
  metadata: DataSourceMetadata;
};
export type Hotspot = {
  id: number;
  name: string;
  distance: number;
  time: string;
  source: string;
  x: number;
  y: number;
  level: "Tinggi" | "Sedang";
};
export type RiskForecast = {
  day: string;
  date: number;
  risk: "Rendah" | "Sedang" | "Tinggi";
  aqi: number;
  bars: number[];
  action: string;
};
export type Alert = {
  id: string;
  title: string;
  detail: string;
  metadata: DataSourceMetadata;
};
export type ChatMessage = {
  id: string;
  from: "assistant" | "user";
  text: string;
  createdAt: string;
};
export type EmergencyGuidance = { title: string; instruction: string };
