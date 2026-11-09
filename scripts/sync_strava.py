"""Ambil lari terbaru dari Strava -> data.js. Kunci HANYA dari environment (GitHub Secrets)."""
import os, json, time, urllib.request, urllib.parse
def post(u, d):
    return json.load(urllib.request.urlopen(urllib.request.Request(u, urllib.parse.urlencode(d).encode())))
t = post("https://www.strava.com/oauth/token", {"client_id": os.environ["STRAVA_CLIENT_ID"], "client_secret": os.environ["STRAVA_CLIENT_SECRET"], "refresh_token": os.environ["STRAVA_REFRESH_TOKEN"], "grant_type": "refresh_token"})
req = urllib.request.Request("https://www.strava.com/api/v3/athlete/activities?per_page=200", headers={"Authorization": "Bearer " + t["access_token"]})
acts = json.load(urllib.request.urlopen(req))
runs = [{"d": a["start_date_local"][:10], "km": round(a["distance"]/1000, 2), "pace": round(a["moving_time"]/(a["distance"]/1000)) if a["distance"] else 0,
         "hr": round(a["average_heartrate"]) if a.get("average_heartrate") else None, "n": a["name"]}
        for a in acts if a["sport_type"] == "Run"]
others = [{"d": a["start_date_local"][:10], "t": a["sport_type"]} for a in acts if a["sport_type"] in ("WeightTraining", "Workout", "Crossfit")]
prev = open("data.js").read()
pr = json.loads(prev.split("pr:")[1].split(",\nruns")[0])
open("data.js", "w").write("window.DATA=" + json.dumps({"athlete": "Damas", "updated": time.strftime("%Y-%m-%d"), "pr": pr, "runs": runs, "others": others}, ensure_ascii=False) + ";")
