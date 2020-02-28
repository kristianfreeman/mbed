# mbed

mbed is an api/ui for programatically returning title/description/meta tags for web pages. this can be used to build link embeds, twitter-style "cards", and more! (that part is coming soon)

very WIP!

```bash
curl -v https://mbed.signalnerve.workers.dev/?url=https://egghead.io 2> >(sed '/^*/d')
  CApath: none
> GET /?url=https://egghead.io HTTP/2
> Host: mbed.signalnerve.workers.dev
> User-Agent: curl/7.54.0
> Accept: */*
>
< HTTP/2 200
< date: Fri, 28 Feb 2020 22:54:41 GMT
< content-type: application/json
< content-length: 348
< set-cookie: __cfduid=d6076872b7c014afa4ae2d5c5838b1e3a1582930480; expires=Sun, 29-Mar-20 22:54:40 GMT; path=/; domain=.signalnerve.workers.dev; HttpOnly; SameSite=Lax
< expect-ct: max-age=604800, report-uri="https://report-uri.cloudflare.com/cdn-cgi/beacon/expect-ct"
< server: cloudflare
< cf-ray: 56c5fb5109bce037-DFW
<
{"title":"egghead.io","description":"Concise screencast video tutorials that cover the best tools, libraries, and frameworks that modern javascript web developers can use to code more effectively and stay current.","image":"https://res.cloudinary.com/dg3gyk0gu/image/upload/v1566948117/transcript-images/Eggo_Notext.png","url":"https://egghead.io"}
```
