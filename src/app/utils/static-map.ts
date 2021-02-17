import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({
    providedIn: "root",
})
export class StaticMapService {
    constructor(private httpClient: HttpClient) {}

    getStaticMapBase64(
        lat: number,
        lng: number,
        radius: string,
        zoom: number
    ): Promise<string> {
        return new Promise((resolve) => {
            this.httpClient
                .get(`https://maps.googleapis.com/maps/api/staticmap`, {
                    params: {
                        key: "AIzaSyBo-0cSqDB1H3mAsfJEdnyhTu0vrBGXsy0",
                        center: `${lat},${lng}`,
                        size: `640x480`,
                        zoom: `${zoom}`,
                        path: `fillcolor:0xff00002D|color:0xf96332ff|enc:${this.drawCirclePath(
                            lat,
                            lng,
                            radius
                        )}`,
                    },
                    responseType: "blob",
                })
                .toPromise()
                .then((imgBlob) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(imgBlob);
                    reader.onloadend = function () {
                        resolve(reader.result.toString());
                    };
                });
        });
    }

    private drawCirclePath(lat, lng, radius, detail = 8) {
        let R = 6371;

        let pi = Math.PI;

        lat = (lat * pi) / 180;
        lng = (lng * pi) / 180;
        let d = radius / R;

        let points: any = [];
        let i = 0;

        for (i = 0; i <= 360; i += detail) {
            let brng = (i * pi) / 180;

            let plat = Math.asin(
                Math.sin(lat) * Math.cos(d) +
                    Math.cos(lat) * Math.sin(d) * Math.cos(brng)
            );
            let plng =
                ((lng +
                    Math.atan2(
                        Math.sin(brng) * Math.sin(d) * Math.cos(lat),
                        Math.cos(d) - Math.sin(lat) * Math.sin(plat)
                    )) *
                    180) /
                pi;
            plat = (plat * 180) / pi;

            let currentPoints: any = [plat, plng];
            points.push(currentPoints);
        }

        return this.createEncodings(points);
    }

    private createEncodings(coords) {
        var i = 0;

        var plat = 0;
        var plng = 0;

        var encoded_points = "";

        for (i = 0; i < coords.length; ++i) {
            var lat = coords[i][0];
            var lng = coords[i][1];

            encoded_points += this.encodePoint(plat, plng, lat, lng);

            plat = lat;
            plng = lng;
        }

        return encoded_points;
    }

    private encodePoint(plat, plng, lat, lng) {
        var dlng = 0;
        var dlat = 0;

        var late5 = Math.round(lat * 1e5);
        var plate5 = Math.round(plat * 1e5);

        var lnge5 = Math.round(lng * 1e5);
        var plnge5 = Math.round(plng * 1e5);

        dlng = lnge5 - plnge5;
        dlat = late5 - plate5;

        return this.encodeSignedNumber(dlat) + this.encodeSignedNumber(dlng);
    }

    private encodeSignedNumber(num) {
        var sgn_num = num << 1;

        if (num < 0) {
            sgn_num = ~sgn_num;
        }

        return this.encodeNumber(sgn_num);
    }

    private encodeNumber(num) {
        var encodeString = "";

        while (num >= 0x20) {
            encodeString += String.fromCharCode((0x20 | (num & 0x1f)) + 63);
            num >>= 5;
        }
        encodeString += String.fromCharCode(num + 63);

        return encodeString;
    }
}