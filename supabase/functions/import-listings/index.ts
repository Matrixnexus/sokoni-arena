import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Raw product data from the uploaded file
const rawListings = [
  {
    "id": "prod_1756681529741_i9pkl",
    "title": "backpack pump",
    "description": "durable",
    "price": 2600,
    "originalPrice": 3500,
    "condition": "new",
    "category": "agriculture",
    "location": "Nyahururu",
    "images": [
      "https://res.cloudinary.com/dxzbol4lf/image/upload/v1756681520/sokoni-arena/u4cu2ovqmikro9f1ahxn.png",
      "https://res.cloudinary.com/dxzbol4lf/image/upload/v1756681522/sokoni-arena/qs3ix0tnzqrcj0rwprjs.jpg",
      "https://res.cloudinary.com/dxzbol4lf/image/upload/v1756681525/sokoni-arena/rum8htrt230ugouovpjh.jpg",
      "https://res.cloudinary.com/dxzbol4lf/image/upload/v1756681528/sokoni-arena/kika4cska2nvwpvtaguf.png"
    ],
    "seller": { "name": "shiru", "phone": "0114720927", "whatsapp": "0114720927", "email": "", "verified": false },
    "isHotDeal": false,
    "featured": false,
    "dateAdded": "2025-08-31"
  },
  {
    "id": "prod_1756715507463_duz9s",
    "title": "Hp Z Book",
    "description": "Hp Z Book Core i7 11th gen 2.50Ghz 8cores 16 logical processor\n32gb RAM 512gb Ssd\nWebcam 15\"\nBack light Keybord",
    "price": 55000,
    "originalPrice": 58999,
    "condition": "refurbished",
    "category": "electronics",
    "location": "Nairobi",
    "images": ["https://res.cloudinary.com/dxzbol4lf/image/upload/v1756715505/sokoni-arena/jel61xhjqg9h61qm8avp.webp"],
    "seller": { "name": "Onetech Computers", "phone": "0708405238", "whatsapp": "0708405238", "email": "", "verified": true },
    "isHotDeal": true,
    "featured": true,
    "dateAdded": "2025-09-01"
  },
  {
    "id": "prod_1756715726754_dn3zw",
    "title": "Hp Omen Keyboard",
    "description": "Hp Omen Keyboard wired keyboard with red back light\nGaming Keyboard",
    "price": 4000,
    "originalPrice": 4599,
    "condition": "new",
    "category": "electronics",
    "location": "Nairobi",
    "images": [
      "https://res.cloudinary.com/dxzbol4lf/image/upload/v1756715722/sokoni-arena/bjl9a5pcstpjxqv6idcc.webp",
      "https://res.cloudinary.com/dxzbol4lf/image/upload/v1756715725/sokoni-arena/nivwcar9zwvb27hvidpk.webp"
    ],
    "seller": { "name": "Computer Fairy KE", "phone": "0708698886", "whatsapp": "0708698886", "email": "", "verified": false },
    "isHotDeal": true,
    "featured": false,
    "dateAdded": "2025-09-01"
  },
  {
    "id": "prod_1756716201391_vmlfn",
    "title": "Dell optiplex 3050",
    "description": "Dell optiplex 3050\nIntel core i7 7th gen\n8gb Ram 500Gb",
    "price": 18000,
    "originalPrice": 18999,
    "condition": "refurbished",
    "category": "electronics",
    "location": "Nairobi",
    "images": [
      "https://res.cloudinary.com/dxzbol4lf/image/upload/v1756716196/sokoni-arena/uhkg2e1zbtiojf8m0vzm.png",
      "https://res.cloudinary.com/dxzbol4lf/image/upload/v1756716199/sokoni-arena/fpext8oy5sxmfpz3knpy.webp"
    ],
    "seller": { "name": "Computer Fairy", "phone": "0708698886", "whatsapp": "0708698886", "email": "", "verified": false },
    "isHotDeal": false,
    "featured": true,
    "dateAdded": "2025-09-01"
  },
  {
    "id": "prod_1756716627290_irx0v",
    "title": "Dell p2422h 24\"",
    "description": "Dell p2422h 24\"\nFull HD Frameless Monitor",
    "price": 11500,
    "originalPrice": 11999,
    "condition": "new",
    "category": "electronics",
    "location": "Nairobi",
    "images": [
      "https://res.cloudinary.com/dxzbol4lf/image/upload/v1756716620/sokoni-arena/w3svzt5msvyza7beftdb.jpg",
      "https://res.cloudinary.com/dxzbol4lf/image/upload/v1756716623/sokoni-arena/ussmcyug9kv2bgilecif.jpg",
      "https://res.cloudinary.com/dxzbol4lf/image/upload/v1756716625/sokoni-arena/fmtt4hdkod81ch8mphuo.jpg"
    ],
    "seller": { "name": "Computer Fairy KE", "phone": "0708698886", "whatsapp": "0708698886", "email": "", "verified": false },
    "isHotDeal": false,
    "featured": true,
    "dateAdded": "2025-09-01"
  },
  {
    "id": "prod_1756720025644_eltf9",
    "title": "Swift subwoofer",
    "description": "2000watts double voice coil",
    "price": 8500,
    "originalPrice": 9000,
    "condition": "new",
    "category": "electronics",
    "location": "Nyahururu",
    "images": ["https://res.cloudinary.com/dxzbol4lf/image/upload/v1756720024/sokoni-arena/sbcmb9azvwwbq9daxhlp.jpg"],
    "seller": { "name": "Salem Equipments", "phone": "0794125899", "whatsapp": "0794125899", "email": "", "verified": false },
    "isHotDeal": true,
    "featured": false,
    "dateAdded": "2025-09-01"
  },
  {
    "id": "prod_1756720307332_f1r2t",
    "title": "Swift equaliser",
    "description": "Powerful and efficient",
    "price": 3000,
    "originalPrice": 3500,
    "condition": "new",
    "category": "electronics",
    "location": "Nyahururu",
    "images": ["https://res.cloudinary.com/dxzbol4lf/image/upload/v1756720305/sokoni-arena/zeylzamjiqf0i3qs1ptk.jpg"],
    "seller": { "name": "Cisco", "phone": "0794125899", "whatsapp": "0794125899", "email": "", "verified": false },
    "isHotDeal": false,
    "featured": true,
    "dateAdded": "2025-09-01"
  },
  {
    "id": "prod_1756730368710_6wzcl",
    "title": "Lenovo t14",
    "description": "Lenovo t14 Core i5 10th gen\n16Gb RAM 256Gb ssd",
    "price": 28000,
    "originalPrice": 30000,
    "condition": "new",
    "category": "electronics",
    "location": "Nairobi",
    "images": [
      "https://res.cloudinary.com/dxzbol4lf/image/upload/v1756730364/sokoni-arena/ot0uy8wzjsfzfcd2k5yz.jpg",
      "https://res.cloudinary.com/dxzbol4lf/image/upload/v1756730367/sokoni-arena/ikvgpc5c5fb3ugd8piko.webp"
    ],
    "seller": { "name": "Onetech Computers", "phone": "0708405238", "whatsapp": "0708405238", "email": "", "verified": false },
    "isHotDeal": false,
    "featured": true,
    "dateAdded": "2025-09-01"
  },
  {
    "id": "prod_1756730707497_b37vv",
    "title": "Macbook 2017",
    "description": "Macbook 2017\nwith a free bag and mouse",
    "price": 30000,
    "originalPrice": 37999,
    "condition": "new",
    "category": "electronics",
    "location": "Nairobi",
    "images": [
      "https://res.cloudinary.com/dxzbol4lf/image/upload/v1756730695/sokoni-arena/pk2ojgl6q7m7gwryrdwk.webp",
      "https://res.cloudinary.com/dxzbol4lf/image/upload/v1756730698/sokoni-arena/vskungnwmhcvxszgiyut.jpg",
      "https://res.cloudinary.com/dxzbol4lf/image/upload/v1756730701/sokoni-arena/er6qzwxn9ifikw4xg9qj.webp",
      "https://res.cloudinary.com/dxzbol4lf/image/upload/v1756730705/sokoni-arena/vygbo0n67wr7dnvm7fey.webp"
    ],
    "seller": { "name": "Laptops Factory", "phone": "0704089181", "whatsapp": "0704089181", "email": "", "verified": false },
    "isHotDeal": false,
    "featured": false,
    "dateAdded": "2025-09-01"
  },
  {
    "id": "prod_1756731845109_dvm8c",
    "title": "LG E2411PB-BN Monitor",
    "description": "Lcd 24\" Wide",
    "price": 5000,
    "originalPrice": 6400,
    "condition": "refurbished",
    "category": "electronics",
    "location": "Nyahururu",
    "images": ["https://res.cloudinary.com/dxzbol4lf/image/upload/v1756731843/sokoni-arena/rzzjpgp8oksshqyeodt0.jpg"],
    "seller": { "name": "Shamatech Stores", "phone": "0703880807", "whatsapp": "0703880807", "email": "", "verified": false },
    "isHotDeal": false,
    "featured": false,
    "dateAdded": "2025-09-01"
  },
  {
    "id": "prod_1756732532593_oaju7",
    "title": "Macbook air",
    "description": "Macbook air core i5\n8Gb RAM 512Gb ssd",
    "price": 22500,
    "originalPrice": 25500,
    "condition": "refurbished",
    "category": "electronics",
    "location": "Nairobi",
    "images": [
      "https://res.cloudinary.com/dxzbol4lf/image/upload/v1756732523/sokoni-arena/iycjhpfseqcczr2edtgr.webp",
      "https://res.cloudinary.com/dxzbol4lf/image/upload/v1756732527/sokoni-arena/qfmgnv9pei8qh0xlpqcf.png",
      "https://res.cloudinary.com/dxzbol4lf/image/upload/v1756732531/sokoni-arena/jxfsl852tjnqr5bsyzy8.png"
    ],
    "seller": { "name": "Onetech Computers", "phone": "0708405238", "whatsapp": "0708405238", "email": "", "verified": false },
    "isHotDeal": false,
    "featured": false,
    "dateAdded": "2025-09-01"
  },
  {
    "id": "prod_1756733178281_ozqfl",
    "title": "Hp Elitebook 1040g8",
    "description": "Hp Elitebook 1040g8\ncore i7 11th gen 3.1 Ghz\n32Gb RAM 512Gb Ssd",
    "price": 55000,
    "originalPrice": 60999,
    "condition": "new",
    "category": "electronics",
    "location": "Nairobi",
    "images": [
      "https://res.cloudinary.com/dxzbol4lf/image/upload/v1756733170/sokoni-arena/liyg4g3mq6bgatq15ic1.jpg",
      "https://res.cloudinary.com/dxzbol4lf/image/upload/v1756733173/sokoni-arena/xl93ix3cqcr4mvhitydu.png"
    ],
    "seller": { "name": "Laptops Factory", "phone": "0704089181", "whatsapp": "0704089181", "email": "", "verified": false },
    "isHotDeal": false,
    "featured": false,
    "dateAdded": "2025-09-01"
  },
  {
    "id": "prod_1756733492894_jjmax",
    "title": "Lenovo Thinkbook",
    "description": "Lenovo Thinkbook Core i5 13th gen\n8Gb RAM 512Gb Ssd",
    "price": 75000,
    "originalPrice": 80999,
    "condition": "new",
    "category": "electronics",
    "location": "Nairobi",
    "images": [
      "https://res.cloudinary.com/dxzbol4lf/image/upload/v1756733488/sokoni-arena/eko02hqsmozhh3lctjwk.jpg",
      "https://res.cloudinary.com/dxzbol4lf/image/upload/v1756733491/sokoni-arena/t92o0hzd85klpccsnqiz.webp"
    ],
    "seller": { "name": "Onetech Computers", "phone": "0708405238", "whatsapp": "0708405238", "email": "", "verified": false },
    "isHotDeal": false,
    "featured": false,
    "dateAdded": "2025-09-01"
  },
  {
    "id": "prod_1756733989413_btvrj",
    "title": "Hp Victus",
    "description": "Hp Victus Core i5-13420H 8Cores 12-Threads 4.60Ghz\nNvidia RTX 3050 6GB Graphics Card\n16Gb RAM 512Gb Ssd\n144Hz Refresh Rate",
    "price": 75000,
    "originalPrice": 79999,
    "condition": "new",
    "category": "electronics",
    "location": "Nairobi",
    "images": [
      "https://res.cloudinary.com/dxzbol4lf/image/upload/v1756733974/sokoni-arena/vy0xgmpmnwj3y1ryo3eh.jpg",
      "https://res.cloudinary.com/dxzbol4lf/image/upload/v1756733979/sokoni-arena/mamx4t0kw2dv88tmercn.jpg",
      "https://res.cloudinary.com/dxzbol4lf/image/upload/v1756733983/sokoni-arena/bljoh59j6kkevwvhqnbp.png",
      "https://res.cloudinary.com/dxzbol4lf/image/upload/v1756733987/sokoni-arena/cca01jd1gsq832qxr1cg.webp"
    ],
    "seller": { "name": "Gamecity Electronics", "phone": "0712248706", "whatsapp": "0712248706", "email": "", "verified": false },
    "isHotDeal": false,
    "featured": false,
    "dateAdded": "2025-09-01"
  },
  {
    "id": "prod_1756734324264_0esdy",
    "title": "Pioneer 12\"",
    "description": "Pioneer 12\" TS-W312D4\n1600watts\n12 inches subwoofer\nDouble coil with double magnet",
    "price": 8499,
    "originalPrice": 9000,
    "condition": "new",
    "category": "electronics",
    "location": "Nairobi",
    "images": [
      "https://res.cloudinary.com/dxzbol4lf/image/upload/v1756734318/sokoni-arena/i7dxhhabc88hbfds862k.jpg",
      "https://res.cloudinary.com/dxzbol4lf/image/upload/v1756734322/sokoni-arena/mvfnjixiygtmelorlifm.webp"
    ],
    "seller": { "name": "Urbanfix Electronics", "phone": "0791070295", "whatsapp": "0791070295", "email": "", "verified": false },
    "isHotDeal": false,
    "featured": true,
    "dateAdded": "2025-09-01"
  },
  {
    "id": "prod_1756735525435_jpbnh",
    "title": "Marcedes Benz E200",
    "description": "Marcedes Benz E200 AMG Line(Pearl Whites).\nMilage 66,000Kms\n2000Cc Petrol :: AMG Line :: Panoramic Sunroof :: Black Leather seats :: Fully loaded",
    "price": 4800000,
    "originalPrice": 5000000,
    "condition": "used",
    "category": "vehicles",
    "location": "Nairobi",
    "images": [
      "https://res.cloudinary.com/dxzbol4lf/image/upload/v1756735518/sokoni-arena/ji6yvfhbt6hx3eq7rj2p.webp",
      "https://res.cloudinary.com/dxzbol4lf/image/upload/v1756735521/sokoni-arena/aqhmk90volmp825z3pp7.webp",
      "https://res.cloudinary.com/dxzbol4lf/image/upload/v1756735523/sokoni-arena/jo3uelcrmvmkljml6izp.jpg"
    ],
    "seller": { "name": "Auto-Place", "phone": "0768040814", "whatsapp": "0768040814", "email": "", "verified": false },
    "isHotDeal": true,
    "featured": false,
    "dateAdded": "2025-09-01"
  },
  {
    "id": "prod_1756738486234_uv5ge",
    "title": "2018 Honda Vezel",
    "description": "2018 Honda Vezel Jungle Green +Hybrid\nMilage 50k Km + 27 Km/L\nAlloy rims\nLane Keep assist\nSeat warmers\nMemory Seats\n7-Speed Dct",
    "price": 2650000,
    "originalPrice": 2999999,
    "condition": "used",
    "category": "vehicles",
    "location": "Nairobi",
    "images": [
      "https://res.cloudinary.com/dxzbol4lf/image/upload/v1756738481/sokoni-arena/ozwds33vbmgosn1fsjwg.jpg",
      "https://res.cloudinary.com/dxzbol4lf/image/upload/v1756738484/sokoni-arena/qdnoukm3c7pde86lbwe8.jpg"
    ],
    "seller": { "name": "Gashmotors_Ke", "phone": "0705725537", "whatsapp": "0705725537", "email": "", "verified": false },
    "isHotDeal": true,
    "featured": false,
    "dateAdded": "2025-09-01"
  },
  {
    "id": "prod_1756739281844_8oiwx",
    "title": "2022 Marcedes Benz s500",
    "description": "2022 Marcedes Benz s500\nEngine Displacement- 3000CC\nmileage-5000miles\n3.0L inline-6 Turbo with Mild Hybrid Drive\nOutput power; 429 Horsepower @5,500rpm & 384 lb-ft torque @1,600rpm\n9-speed automatic transmission\nAll-wheel drivetrain (4MATIC)\n0-60 mph in around 4.9 seconds\nPearl white Exterior\nAdaptive LED lighting with Ultra Range high beams",
    "price": 18800000,
    "originalPrice": 20000000,
    "condition": "used",
    "category": "vehicles",
    "location": "Nairobi",
    "images": [
      "https://res.cloudinary.com/dxzbol4lf/image/upload/v1756739269/sokoni-arena/syevpgeyu47jorfg4gyi.jpg",
      "https://res.cloudinary.com/dxzbol4lf/image/upload/v1756739272/sokoni-arena/qmajmdcx9zwgrjauqncc.jpg",
      "https://res.cloudinary.com/dxzbol4lf/image/upload/v1756739275/sokoni-arena/cpffwrbmmi5zg3ibixso.jpg",
      "https://res.cloudinary.com/dxzbol4lf/image/upload/v1756739280/sokoni-arena/z0ikqpihdtesuabkxdkv.jpg"
    ],
    "seller": { "name": "Awarded_auto.cars", "phone": "0748399843", "whatsapp": "0748399843", "email": "", "verified": false },
    "isHotDeal": false,
    "featured": false,
    "dateAdded": "2025-09-01"
  },
  {
    "id": "prod_1756754946336_f6bdb",
    "title": "2018 AUDI A5",
    "description": "2018 AUDI A5 SUNROOF 2000CC TFSI PETROL POWERED ENGINE\nElectric adjustable fabric heated seats Multi Functional steering wheel\nOriginal alloy sports rims",
    "price": 4500000,
    "originalPrice": 4999999,
    "condition": "used",
    "category": "vehicles",
    "location": "Mombasa",
    "images": [
      "https://res.cloudinary.com/dxzbol4lf/image/upload/v1756754935/sokoni-arena/kcaqb9vcrfos2uzbxh3t.jpg",
      "https://res.cloudinary.com/dxzbol4lf/image/upload/v1756754938/sokoni-arena/tfkcg5gfjvunls4feuzt.jpg",
      "https://res.cloudinary.com/dxzbol4lf/image/upload/v1756754941/sokoni-arena/dn943gznm4i6y2pc6fu5.jpg",
      "https://res.cloudinary.com/dxzbol4lf/image/upload/v1756754944/sokoni-arena/qmklg3nxvr91wrecacpe.jpg"
    ],
    "seller": { "name": "Mombasa Motors", "phone": "0700803405", "whatsapp": "0700803405", "email": "", "verified": false },
    "isHotDeal": true,
    "featured": true,
    "dateAdded": "2025-09-01"
  },
  {
    "id": "prod_1756755620261_1u0qd",
    "title": "2017 Audi A5 S LINE B9 QUATTRO",
    "description": "2017 Audi A5 S LINE B9 QUATTRO With sunroof\nEngine capacity::2000CC\nEngine type 4-Cylinder in-line 16-valve Turbo charged\nFUEL TYPE :: Petrol\nPerformance; power=252 HP, Torque= 370NM",
    "price": 3950000,
    "originalPrice": 3999999,
    "condition": "used",
    "category": "vehicles",
    "location": "Nairobi",
    "images": [
      "https://res.cloudinary.com/dxzbol4lf/image/upload/v1756755609/sokoni-arena/rd4nx84vfrug1covxu97.jpg",
      "https://res.cloudinary.com/dxzbol4lf/image/upload/v1756755612/sokoni-arena/zriegcqyhls86r5gv7i0.jpg",
      "https://res.cloudinary.com/dxzbol4lf/image/upload/v1756755615/sokoni-arena/lnkfqgtzpb03xiqsadbc.jpg",
      "https://res.cloudinary.com/dxzbol4lf/image/upload/v1756755618/sokoni-arena/n3stsgkskn4slsknyamt.jpg"
    ],
    "seller": { "name": "NairobiDrive Autos", "phone": "0701128886", "whatsapp": "0701128886", "email": "", "verified": false },
    "isHotDeal": false,
    "featured": false,
    "dateAdded": "2025-09-01"
  },
  {
    "id": "prod_1756756650022_ctsdt",
    "title": "Samsung Galaxy s21 ultra",
    "description": "Samsung Galaxy s21 ultra 256Gb\nDual sim\nSamsung Health Tracker\nExcellent Camera\nFingerprint Sensor\nFace ID",
    "price": 45000,
    "originalPrice": 47000,
    "condition": "refurbished",
    "category": "electronics",
    "location": "Nairobi",
    "images": [
      "https://res.cloudinary.com/dxzbol4lf/image/upload/v1756756633/sokoni-arena/y5l6ql8ksicvwdz9f6ba.jpg",
      "https://res.cloudinary.com/dxzbol4lf/image/upload/v1756756637/sokoni-arena/lxtjf9hanmkorfrlk9bv.jpg",
      "https://res.cloudinary.com/dxzbol4lf/image/upload/v1756756640/sokoni-arena/ytb3oic4yzp7zqnj5kap.webp",
      "https://res.cloudinary.com/dxzbol4lf/image/upload/v1756756643/sokoni-arena/cklr6t8nt3yidoyvwfow.jpg",
      "https://res.cloudinary.com/dxzbol4lf/image/upload/v1756756647/sokoni-arena/idwmjogttuceyhjok4f8.jpg"
    ],
    "seller": { "name": "The Tech Tunnel", "phone": "0740718067", "whatsapp": "0740718067", "email": "", "verified": false },
    "isHotDeal": false,
    "featured": false,
    "dateAdded": "2025-09-01"
  },
  {
    "id": "prod_1756757871792_cw185",
    "title": "Dinner set",
    "description": "6 cups\n6 plates",
    "price": 1800,
    "originalPrice": 2000,
    "condition": "new",
    "category": "home",
    "location": "Nairobi",
    "images": ["https://res.cloudinary.com/dxzbol4lf/image/upload/v1756757870/sokoni-arena/fkwxp1gieydulecu1edj.jpg"],
    "seller": { "name": "Steve hub collection", "phone": "0745158721", "whatsapp": "0745158721", "email": "", "verified": false },
    "isHotDeal": false,
    "featured": false,
    "dateAdded": "2025-09-01"
  },
  {
    "id": "prod_1756758651406_eknju",
    "title": "2018-AUDI TT COUPE CONVERTIBLE",
    "description": "2018-AUDI TT COUPE CONVERTIBLE\nEngine type: 2.0L turbocharged 4 -cylider engine\nHorsepower: 288hp\nTorque: 280lb-ft @1800-5,200rpm\nTransmission: 6-speed dual-clutch automatic(stronic)",
    "price": 4700000,
    "originalPrice": 4999999,
    "condition": "used",
    "category": "vehicles",
    "location": "Nairobi",
    "images": [
      "https://res.cloudinary.com/dxzbol4lf/image/upload/v1756758640/sokoni-arena/st3knq6ml1q0tf5leqyh.webp",
      "https://res.cloudinary.com/dxzbol4lf/image/upload/v1756758644/sokoni-arena/ysug2024xwrbviulfram.webp",
      "https://res.cloudinary.com/dxzbol4lf/image/upload/v1756758646/sokoni-arena/ayftckiuz843st4ctsfc.jpg",
      "https://res.cloudinary.com/dxzbol4lf/image/upload/v1756758650/sokoni-arena/lj2xn2ifilsu3akuab91.webp"
    ],
    "seller": { "name": "MASLAH", "phone": "0742445688", "whatsapp": "0742445688", "email": "", "verified": false },
    "isHotDeal": false,
    "featured": false,
    "dateAdded": "2025-09-01"
  },
  {
    "id": "prod_1756759391894_v3x3t",
    "title": "Shoe rack",
    "description": "Shoe rack Carries 40 pairs",
    "price": 4500,
    "originalPrice": 4999,
    "condition": "new",
    "category": "home",
    "location": "Nairobi",
    "images": [
      "https://res.cloudinary.com/dxzbol4lf/image/upload/v1756759387/sokoni-arena/wxu566y0kwkxecoyc4ag.jpg",
      "https://res.cloudinary.com/dxzbol4lf/image/upload/v1756759390/sokoni-arena/qwg7obaozlik6tfboro6.jpg"
    ],
    "seller": { "name": "Elegant interior", "phone": "0722330932", "whatsapp": "0722330932", "email": "", "verified": false },
    "isHotDeal": true,
    "featured": false,
    "dateAdded": "2025-09-01"
  },
  {
    "id": "prod_1756759723997_jmej3",
    "title": "Simple open closet",
    "description": "Simple open closet",
    "price": 15000,
    "originalPrice": 16999,
    "condition": "new",
    "category": "home",
    "location": "Nyahururu",
    "images": [
      "https://res.cloudinary.com/dxzbol4lf/image/upload/v1756759718/sokoni-arena/nkkdpua1catz20zrbp5i.jpg",
      "https://res.cloudinary.com/dxzbol4lf/image/upload/v1756759722/sokoni-arena/rpod3flfzobmnnlvtfh1.jpg"
    ],
    "seller": { "name": "Cisco", "phone": "0708083263", "whatsapp": "0708083263", "email": "", "verified": false },
    "isHotDeal": false,
    "featured": true,
    "dateAdded": "2025-09-01"
  },
  {
    "id": "prod_1756760035392_0avm3",
    "title": "Coffee Table",
    "description": "Coffee Table",
    "price": 4500,
    "originalPrice": 5000,
    "condition": "new",
    "category": "home",
    "location": "Nairobi",
    "images": ["https://res.cloudinary.com/dxzbol4lf/image/upload/v1756760034/sokoni-arena/m2by1szgpfu0kzla24fk.jpg"],
    "seller": { "name": "Royal Home Furniture", "phone": "0741303028", "whatsapp": "0741303028", "email": "", "verified": false },
    "isHotDeal": false,
    "featured": true,
    "dateAdded": "2025-09-01"
  },
  {
    "id": "prod_1756820626899_kwg1l",
    "title": "lenovo m625q mini pc",
    "description": "Amd e2 - 9000e\n4gb ram - DDR3\n128gb ssd\nkeyboard + mouse",
    "price": 8000,
    "originalPrice": 9500,
    "condition": "new",
    "category": "electronics",
    "location": "Nairobi",
    "images": ["https://res.cloudinary.com/dxzbol4lf/image/upload/v1756820625/sokoni-arena/ubqjqdxiwbxacuyeqvg5.jpg"],
    "seller": { "name": "Shamatech Stores", "phone": "0703880807", "whatsapp": "0703880807", "email": "", "verified": false },
    "isHotDeal": false,
    "featured": false,
    "dateAdded": "2025-09-02"
  },
  {
    "id": "prod_1756820932637_fydpg",
    "title": "Hp Elitedesk 705 g4 sff",
    "description": "AMD RYZEN 5 2400\nRADEON VEGA GPU - 2GB\n16gb ram\n250gb hdd",
    "price": 14000,
    "originalPrice": 15500,
    "condition": "refurbished",
    "category": "electronics",
    "location": "Nairobi",
    "images": [
      "https://res.cloudinary.com/dxzbol4lf/image/upload/v1756820922/sokoni-arena/vtr6izdo4wozcxxruxof.jpg",
      "https://res.cloudinary.com/dxzbol4lf/image/upload/v1756820927/sokoni-arena/vfixveyrafxk4fjqlzbs.jpg",
      "https://res.cloudinary.com/dxzbol4lf/image/upload/v1756820931/sokoni-arena/kclnsgbmordkou7d3zub.jpg"
    ],
    "seller": { "name": "Shamatech Stores", "phone": "0703880807", "whatsapp": "0703880807", "email": "", "verified": false },
    "isHotDeal": false,
    "featured": false,
    "dateAdded": "2025-09-02"
  },
  {
    "id": "prod_1756821420179_h51ba",
    "title": "PC Apple imac 18, 1",
    "description": "Intel (R)tm I5 - 73600\n2017 model\ncpu speed - 2.30MHZ\n8gb ram DDR4\nIntel Iris Plus graphics 640 1536mb\n1Tb HDD",
    "price": 5000,
    "originalPrice": 58000,
    "condition": "new",
    "category": "electronics",
    "location": "Nairobi",
    "images": ["https://res.cloudinary.com/dxzbol4lf/image/upload/v1756821418/sokoni-arena/blkrc42te5hysnbbkvbr.jpg"],
    "seller": { "name": "Shamatech Stores", "phone": "0703880807", "whatsapp": "0703880807", "email": "", "verified": false },
    "isHotDeal": false,
    "featured": false,
    "dateAdded": "2025-09-02"
  },
  {
    "id": "prod_1756821885276_jljkz",
    "title": "Dell Optiplex 7040 m7",
    "description": "Intel Core i7 gen 6\n8gb ram\n500gb hdd",
    "price": 16000,
    "originalPrice": 18000,
    "condition": "new",
    "category": "electronics",
    "location": "Nyahururu",
    "images": [
      "https://res.cloudinary.com/dxzbol4lf/image/upload/v1756821878/sokoni-arena/nvqohifus4razpmmao4b.jpg",
      "https://res.cloudinary.com/dxzbol4lf/image/upload/v1756821880/sokoni-arena/pgblsyonen3yngsjvqhu.jpg",
      "https://res.cloudinary.com/dxzbol4lf/image/upload/v1756821883/sokoni-arena/iqp6madfatro4zg40tpv.jpg"
    ],
    "seller": { "name": "Shamatech Stores", "phone": "0703880807", "whatsapp": "0703880807", "email": "", "verified": false },
    "isHotDeal": true,
    "featured": true,
    "dateAdded": "2025-09-02"
  },
  {
    "id": "prod_1756822311349_3m7yc",
    "title": "Imac 16",
    "description": "Intel Core I5 tm 52500 (2015)",
    "price": 38000,
    "originalPrice": 40500,
    "condition": "refurbished",
    "category": "electronics",
    "location": "Nairobi",
    "images": [
      "https://res.cloudinary.com/dxzbol4lf/image/upload/v1756822301/sokoni-arena/q3spgtsjsb6nwvohpgcj.jpg",
      "https://res.cloudinary.com/dxzbol4lf/image/upload/v1756822306/sokoni-arena/ge0abttzr9odsnpvcost.jpg",
      "https://res.cloudinary.com/dxzbol4lf/image/upload/v1756822309/sokoni-arena/ga2leyfix8nekmqftnhw.jpg"
    ],
    "seller": { "name": "Shamatech Stores", "phone": "0703880807", "whatsapp": "0703880807", "email": "", "verified": false },
    "isHotDeal": false,
    "featured": true,
    "dateAdded": "2025-09-02"
  },
  {
    "id": "prod_1756822615377_2clp9",
    "title": "Hp Elite Display Monitor",
    "description": "22 inch wide with webcam",
    "price": 7500,
    "originalPrice": 9500,
    "condition": "refurbished",
    "category": "electronics",
    "location": "Nyahururu",
    "images": [
      "https://res.cloudinary.com/dxzbol4lf/image/upload/v1756822608/sokoni-arena/ty0c5t3p0rvr4tdngd8s.jpg",
      "https://res.cloudinary.com/dxzbol4lf/image/upload/v1756822611/sokoni-arena/muynelyo03ymupbohxad.jpg",
      "https://res.cloudinary.com/dxzbol4lf/image/upload/v1756822613/sokoni-arena/zkiaj5zu3ypclwsmaimx.png"
    ],
    "seller": { "name": "Shamatech Stores", "phone": "0703880807", "whatsapp": "0703880807", "email": "", "verified": false },
    "isHotDeal": false,
    "featured": false,
    "dateAdded": "2025-09-02"
  },
  {
    "id": "prod_1756822886425_dvtew",
    "title": "swift crossover",
    "description": "three way",
    "price": 4000,
    "originalPrice": 5500,
    "condition": "new",
    "category": "electronics",
    "location": "Nyahururu",
    "images": ["https://res.cloudinary.com/dxzbol4lf/image/upload/v1756822884/sokoni-arena/nrvzd5ynzjgh2t6myeyb.jpg"],
    "seller": { "name": "Salem Equipments", "phone": "0794125899", "whatsapp": "0794125899", "email": "", "verified": false },
    "isHotDeal": false,
    "featured": true,
    "dateAdded": "2025-09-02"
  },
  {
    "id": "prod_1756823089812_c7yxb",
    "title": "swift Installation kit",
    "description": "four gauge",
    "price": 2500,
    "originalPrice": 3000,
    "condition": "new",
    "category": "electronics",
    "location": "Nyahururu",
    "images": ["https://res.cloudinary.com/dxzbol4lf/image/upload/v1756823088/sokoni-arena/zu4zg0lhcnaq4jccw1mv.jpg"],
    "seller": { "name": "Salem Equipments", "phone": "0794125899", "whatsapp": "0794125899", "email": "", "verified": false },
    "isHotDeal": false,
    "featured": false,
    "dateAdded": "2025-09-02"
  },
  {
    "id": "prod_1756823343392_ko81u",
    "title": "swift monoblock amplifier",
    "description": "four channel 1600 heavy duty",
    "price": 7500,
    "originalPrice": 8500,
    "condition": "new",
    "category": "electronics",
    "location": "Nyahururu",
    "images": ["https://res.cloudinary.com/dxzbol4lf/image/upload/v1756823341/sokoni-arena/az9zihcg5yubcprppuh4.jpg"],
    "seller": { "name": "Salem Equipments", "phone": "0794125899", "whatsapp": "0794125899", "email": "", "verified": true },
    "isHotDeal": true,
    "featured": true,
    "dateAdded": "2025-09-02"
  },
  {
    "id": "prod_1756895707838_tdusi",
    "title": "swift midrange speakers",
    "description": "6*9 high power with descents 8d sounds",
    "price": 3500,
    "originalPrice": null,
    "condition": "new",
    "category": "electronics",
    "location": "Nyahururu",
    "images": ["https://res.cloudinary.com/dxzbol4lf/image/upload/v1756895707/sokoni-arena/tldrllebvbvy1bqtyu3u.jpg"],
    "seller": { "name": "Salem Equipments", "phone": "0794125899", "whatsapp": "0794125899", "email": "matrixsolutions@gmail.com", "verified": true },
    "isHotDeal": false,
    "featured": false,
    "dateAdded": "2025-09-03"
  },
  {
    "id": "prod_1757406103038_gnlb4",
    "title": "Dell Precision 3630",
    "description": "Core i7 16Gb Ram 1Tb Hdd and 2Gb Graphics Card",
    "price": 70000,
    "originalPrice": null,
    "condition": "new",
    "category": "electronics",
    "location": "Nairobi",
    "images": ["https://res.cloudinary.com/dxzbol4lf/image/upload/v1757406101/sokoni-arena/xmidvbdfgriytyqtxwhl.jpg"],
    "seller": { "name": "Comrade Computer Garage", "phone": "0727296529", "whatsapp": "0727296529", "email": "", "verified": true },
    "isHotDeal": false,
    "featured": false,
    "dateAdded": "2025-09-09"
  },
  {
    "id": "prod_1757785799295_f5x2f",
    "title": "120 watts laptop charger for Hp",
    "description": "120 watts laptop charger for Hp",
    "price": 1000,
    "originalPrice": null,
    "condition": "new",
    "category": "electronics",
    "location": "Nairobi",
    "images": ["https://res.cloudinary.com/dxzbol4lf/image/upload/v1757785798/sokoni-arena/szpnfnqa5vuxt97wqi1d.jpg"],
    "seller": { "name": "Computer Comrades", "phone": "0727296529", "whatsapp": "0727296529", "email": "", "verified": false },
    "isHotDeal": false,
    "featured": false,
    "dateAdded": "2025-09-13"
  },
  {
    "id": "prod_1757786629928_whb3e",
    "title": "Mini pc",
    "description": "Hp 800g3 Intel Core i5 7th Gen 8gb Ram 256gb SSD",
    "price": 13500,
    "originalPrice": null,
    "condition": "new",
    "category": "electronics",
    "location": "Nairobi",
    "images": ["https://res.cloudinary.com/dxzbol4lf/image/upload/v1757786629/sokoni-arena/u6j4hcqecjyeboi557je.jpg"],
    "seller": { "name": "Computer Comrades", "phone": "0727296529", "whatsapp": "0727296529", "email": "", "verified": true },
    "isHotDeal": false,
    "featured": false,
    "dateAdded": "2025-09-13"
  },
  {
    "id": "prod_1757787710515_mwz44",
    "title": "2023 used boxer motor bike",
    "description": "Driven 9580 miles",
    "price": 35000,
    "originalPrice": null,
    "condition": "used",
    "category": "vehicles",
    "location": "Nyahururu",
    "images": [
      "https://res.cloudinary.com/dxzbol4lf/image/upload/v1757787698/sokoni-arena/tneoh5rdwzl3yu91vqxk.jpg",
      "https://res.cloudinary.com/dxzbol4lf/image/upload/v1757787702/sokoni-arena/rxhzbgzwq0xgzc9giyns.jpg",
      "https://res.cloudinary.com/dxzbol4lf/image/upload/v1757787705/sokoni-arena/havgf1lu2y67wgxmizyi.jpg",
      "https://res.cloudinary.com/dxzbol4lf/image/upload/v1757787710/sokoni-arena/fi3yfaclhmdwkiyz2wdn.jpg"
    ],
    "seller": { "name": "Dann Danson", "phone": "0752040871", "whatsapp": "0752040871", "email": "", "verified": true },
    "isHotDeal": false,
    "featured": false,
    "dateAdded": "2025-09-13"
  },
  {
    "id": "prod_1757793202978_mjpnh",
    "title": "Toyota Townce manual diesel",
    "description": "Toyota Townce manual diesel price negotiable upon viewing of the car",
    "price": 320000,
    "originalPrice": null,
    "condition": "used",
    "category": "vehicles",
    "location": "Nyahururu",
    "images": [
      "https://res.cloudinary.com/dxzbol4lf/image/upload/v1757793187/sokoni-arena/zrvgr3jvmegy1lrzzljl.jpg",
      "https://res.cloudinary.com/dxzbol4lf/image/upload/v1757793191/sokoni-arena/injft0sucszl1jv9qfsg.jpg",
      "https://res.cloudinary.com/dxzbol4lf/image/upload/v1757793195/sokoni-arena/plbkhsrqzeqp9sgy0wu4.jpg",
      "https://res.cloudinary.com/dxzbol4lf/image/upload/v1757793198/sokoni-arena/n1slml5g1ryzv5p6g4sk.jpg",
      "https://res.cloudinary.com/dxzbol4lf/image/upload/v1757793202/sokoni-arena/fyhllpvqewqrarmkzw54.jpg"
    ],
    "seller": { "name": "Kevin Automotors Yard", "phone": "0748430906", "whatsapp": "0748430906", "email": "", "verified": true },
    "isHotDeal": false,
    "featured": false,
    "dateAdded": "2025-09-13"
  },
  {
    "id": "prod_1758014964314_m8vdn",
    "title": "Nec Laptop",
    "description": "New Intel 11th gen 4Gb 64Gb ssd",
    "price": 10000,
    "originalPrice": null,
    "condition": "new",
    "category": "electronics",
    "location": "Nairobi",
    "images": [
      "https://res.cloudinary.com/dxzbol4lf/image/upload/v1758014960/sokoni-arena/eey3vidgm7p4bjxribtu.jpg",
      "https://res.cloudinary.com/dxzbol4lf/image/upload/v1758014964/sokoni-arena/qhrrimpx31qox0wwteqi.jpg"
    ],
    "seller": { "name": "Onetech Computers", "phone": "0708405238", "whatsapp": "0708405238", "email": "", "verified": true },
    "isHotDeal": false,
    "featured": false,
    "dateAdded": "2025-09-16"
  },
  {
    "id": "prod_1758101592573_h3wh5",
    "title": "gaming keyboard and mouse",
    "description": "Mechanical RGB Back lit keyboard",
    "price": 1700,
    "originalPrice": null,
    "condition": "new",
    "category": "electronics",
    "location": "Nyahururu",
    "images": [
      "https://res.cloudinary.com/dxzbol4lf/image/upload/v1758101577/sokoni-arena/ilmdxbvtot1bgbooorsc.webp",
      "https://res.cloudinary.com/dxzbol4lf/image/upload/v1758101581/sokoni-arena/cusdjzvb8bktqshcfqy7.webp",
      "https://res.cloudinary.com/dxzbol4lf/image/upload/v1758101585/sokoni-arena/on88xsgjp8pqwcmqyfnf.webp",
      "https://res.cloudinary.com/dxzbol4lf/image/upload/v1758101589/sokoni-arena/glbexqwihhe4ior9eyef.webp",
      "https://res.cloudinary.com/dxzbol4lf/image/upload/v1758101592/sokoni-arena/eizbpsmogwhjgnvoxdxp.webp"
    ],
    "seller": { "name": "Matrix Solutions", "phone": "0114701233", "whatsapp": "0114701233", "email": "matrixsolutions254@gmail.com", "verified": true },
    "isHotDeal": true,
    "featured": false,
    "dateAdded": "2025-09-17"
  },
  {
    "id": "prod_1758101822081_mi31x",
    "title": "Gaming Headphones",
    "description": "High Definition Sound And Clear High Quality Microphone",
    "price": 1800,
    "originalPrice": null,
    "condition": "new",
    "category": "electronics",
    "location": "Nyahururu",
    "images": [
      "https://res.cloudinary.com/dxzbol4lf/image/upload/v1758101810/sokoni-arena/co3i895vqis5yxsa79l0.webp",
      "https://res.cloudinary.com/dxzbol4lf/image/upload/v1758101813/sokoni-arena/lwenf5cvzo4sfhh9tmqe.webp",
      "https://res.cloudinary.com/dxzbol4lf/image/upload/v1758101817/sokoni-arena/ihelkjz95apaezagtxrv.webp",
      "https://res.cloudinary.com/dxzbol4lf/image/upload/v1758101821/sokoni-arena/pcs4sgnrnpjwqnqffdpc.webp"
    ],
    "seller": { "name": "Matrix Solutions", "phone": "0114701233", "whatsapp": "0114701233", "email": "matrixsolutions254@gmail.com", "verified": true },
    "isHotDeal": true,
    "featured": false,
    "dateAdded": "2025-09-17"
  },
  {
    "id": "prod_1758102231043_i6itj",
    "title": "Blender",
    "description": "All In One High Quality blender",
    "price": 1800,
    "originalPrice": null,
    "condition": "new",
    "category": "home",
    "location": "Nyahururu",
    "images": [
      "https://res.cloudinary.com/dxzbol4lf/image/upload/v1758102223/sokoni-arena/ysvlijwxygpenzcsfjuo.webp",
      "https://res.cloudinary.com/dxzbol4lf/image/upload/v1758102227/sokoni-arena/d7pjc6lfmkt3shdx2mo9.webp",
      "https://res.cloudinary.com/dxzbol4lf/image/upload/v1758102230/sokoni-arena/nyjhmua1vmhgorrtgshl.webp"
    ],
    "seller": { "name": "Matrix Solutions", "phone": "0114701233", "whatsapp": "0114701233", "email": "matrixsolutions254@gmail.com", "verified": true },
    "isHotDeal": true,
    "featured": false,
    "dateAdded": "2025-09-17"
  }
];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

    // Step 1: Clear existing listings (except admin user's)
    const { error: deleteListingsError } = await supabase
      .from("listings")
      .delete()
      .neq("user_id", "9a4d2fcb-847d-4ca5-8a93-e2e047c1bead"); // Keep admin listings if any

    if (deleteListingsError) {
      console.error("Error deleting listings:", deleteListingsError);
    }

    // Step 2: Group listings by seller (normalized by phone number)
    const sellerMap = new Map<string, { seller: any; listings: any[] }>();
    
    for (const listing of rawListings) {
      const phone = listing.seller.phone.replace(/\s+/g, "").replace(/[^0-9]/g, "");
      
      if (!sellerMap.has(phone)) {
        sellerMap.set(phone, { seller: listing.seller, listings: [] });
      }
      sellerMap.get(phone)!.listings.push(listing);
    }

    console.log(`Found ${sellerMap.size} unique sellers`);

    const results = {
      sellersCreated: 0,
      listingsCreated: 0,
      errors: [] as string[]
    };

    // Step 3: Create users and their listings
    for (const [phone, data] of sellerMap) {
      try {
        const { seller, listings } = data;
        const normalizedName = seller.name.trim().toLowerCase().replace(/[^a-z0-9]/g, "_");
        const email = seller.email && seller.email.includes("@") && seller.email.includes(".") 
          ? seller.email 
          : `${normalizedName}_${phone.slice(-4)}@sokoni.marketplace`;

        // Create auth user
        const { data: userData, error: userError } = await supabase.auth.admin.createUser({
          email,
          password: `Sokoni2025!${phone.slice(-4)}`,
          email_confirm: true,
          user_metadata: {
            username: seller.name,
            phone: phone.startsWith("0") ? `+254${phone.slice(1)}` : phone
          }
        });

        if (userError) {
          // User might already exist, try to find them
          const { data: existingProfiles } = await supabase
            .from("profiles")
            .select("user_id")
            .eq("phone", phone)
            .limit(1);
          
          if (!existingProfiles || existingProfiles.length === 0) {
            results.errors.push(`Failed to create user for ${seller.name}: ${userError.message}`);
            continue;
          }
        }

        const userId = userData?.user?.id;
        if (!userId) {
          results.errors.push(`No user ID for ${seller.name}`);
          continue;
        }

        // Update profile with additional info
        const { error: profileError } = await supabase
          .from("profiles")
          .update({
            phone: phone.startsWith("0") ? phone : `0${phone}`,
            is_verified: seller.verified || false,
            location: listings[0]?.location || "Kenya"
          })
          .eq("user_id", userId);

        if (profileError) {
          console.error(`Profile update error for ${seller.name}:`, profileError);
        }

        results.sellersCreated++;

        // Create listings for this seller
        for (const listing of listings) {
          const listingData = {
            user_id: userId,
            title: listing.title,
            description: listing.description,
            price: listing.price,
            original_price: listing.originalPrice,
            images: listing.images,
            location: listing.location,
            category: listing.category,
            listing_type: "product" as const,
            status: "available" as const,
            is_featured: listing.featured || false,
            is_sponsored: listing.isHotDeal || false
          };

          const { error: listingError } = await supabase
            .from("listings")
            .insert(listingData);

          if (listingError) {
            results.errors.push(`Failed to create listing "${listing.title}": ${listingError.message}`);
          } else {
            results.listingsCreated++;
          }
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        results.errors.push(`Error processing seller ${data.seller.name}: ${errorMessage}`);
      }
    }

    return new Response(JSON.stringify(results), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500
    });
  }
});
