import http from "k6/http";
import { check, sleep } from "k6";
import { Trend } from "k6/metrics";

const base = __ENV.BASE_URL || "http://127.0.0.1:3000";
const scenario = __ENV.SCENARIO || "normal";
const profileLatency = new Trend("profile_latency");
const coursesLatency = new Trend("courses_latency");
const messagesLatency = new Trend("messages_latency");
const configs = {
  normal: { vus: 10, duration: "2m" },
  elevated: { vus: 30, duration: "3m" },
  stress: { stages: [
    { duration: "1m", target: 25 }, { duration: "1m", target: 50 },
    { duration: "1m", target: 75 }, { duration: "1m", target: 100 }
  ] }
};

export const options = {
  ...(configs[scenario] || configs.normal),
  thresholds: {
    http_req_duration: ["p(95)<500", "p(99)<1000"],
    http_req_failed: ["rate<0.01"]
  }
};

export default function () {
  const endpoints = [
    ["/api/student", profileLatency],
    ["/api/courses", coursesLatency],
    ["/api/messages", messagesLatency]
  ];
  for (const [endpoint, latency] of endpoints) {
    const response = http.get(`${base}${endpoint}`);
    latency.add(response.timings.duration);
    check(response, {
      [`${endpoint} responde 200`]: (result) => result.status === 200,
      [`${endpoint} devuelve JSON`]: (result) => {
        try { return typeof result.json() === "object"; } catch { return false; }
      }
    });
  }
  sleep(1);
}
