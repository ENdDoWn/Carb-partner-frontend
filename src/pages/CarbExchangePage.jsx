import React, { useEffect, useMemo, useState } from 'react';
import { 
   ChevronLeft, Search, ArrowUpDown
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Import Shared Components
import MobileLayout from '../components/MobileLayout';
import Navigation from '../components/Navigation';
import { getUserInfo, getDailyCarbTotal } from '../Api/User';

const GRAMS_PER_CARB = 15;

const CarbExchangePage = () => {
   const navigate = useNavigate();

   const [dailyCarb, setDailyCarb] = useState({ used: 0, limit: 0 });

   useEffect(() => {
      const fetchDailyCarb = async () => {
         try {
            const [userInfo, dailyCarbTotal] = await Promise.all([
               getUserInfo(),
               getDailyCarbTotal(),
            ]);

            const user = userInfo?.user ?? userInfo;
            const carbExpectGram = Number(user?.carb_expect ?? user?.carbGoal ?? 0);
            const carbCurrentGram = Number(dailyCarbTotal?.totalCarb ?? 0);

            setDailyCarb({
               used: carbCurrentGram > 0 ? carbCurrentGram / GRAMS_PER_CARB : 0,
               limit: carbExpectGram > 0 ? carbExpectGram / GRAMS_PER_CARB : 0,
            });
         } catch (error) {
            setDailyCarb({ used: 0, limit: 0 });
         }
      };

      fetchDailyCarb();
   }, []);

   const remainingCarb = Math.max(dailyCarb.limit - dailyCarb.used, 0);
   const progressPercent = dailyCarb.limit > 0 ? Math.min((dailyCarb.used / dailyCarb.limit) * 100, 100) : 0;

   const foodItems = [
  {
    "id": 1,
    "name": "บะหมี่น้ำหมูลูกชิ้น",
    "detail": "417 กรัม (400 กิโลแคลอรี)",
    "carb": 2,
    "emoji": "🍜",
    "type": "single_dish",
    "bg": "bg-yellow-100"
  },
  {
    "id": 2,
    "name": "ผัดซีอิ๊วหมูใส่ไข่",
    "detail": "241 กรัม (535 กิโลแคลอรี)",
    "carb": 3.3,
    "emoji": "🍝",
    "type": "single_dish",
    "bg": "bg-yellow-100"
  },
  {
    "id": 3,
    "name": "ราดหน้าเส้นใหญ่หมู",
    "detail": "485 กรัม (452 กิโลแคลอรี)",
    "carb": 2.8,
    "emoji": "🍲",
    "type": "single_dish",
    "bg": "bg-yellow-100"
  },
  {
    "id": 4,
    "name": "ก๋วยเตี๋ยวเส้นหมี่ไก่มะระ",
    "detail": "650 กรัม (300 กิโลแคลอรี)",
    "carb": 2,
    "emoji": "🍜",
    "type": "single_dish",
    "bg": "bg-yellow-100"
  },
  {
    "id": 5,
    "name": "สุกี้ทะเล",
    "detail": "590 กรัม (235 กิโลแคลอรี)",
    "carb": 1.7,
    "emoji": "🍲",
    "type": "single_dish",
    "bg": "bg-yellow-100"
  },
  {
    "id": 6,
    "name": "ผัดไทยใส่ไข่",
    "detail": "268 กรัม (600 กิโลแคลอรี)",
    "carb": 3,
    "emoji": "🍝",
    "type": "single_dish",
    "bg": "bg-yellow-100"
  },
  {
    "id": 7,
    "name": "ข้าวหมกไก่",
    "detail": "340 กรัม (505 กิโลแคลอรี)",
    "carb": 3.6,
    "emoji": "🍛",
    "type": "single_dish",
    "bg": "bg-yellow-100"
  },
  {
    "id": 8,
    "name": "ขนมจีนน้ำยา",
    "detail": "391 กรัม (225 กิโลแคลอรี)",
    "carb": 1.7,
    "emoji": "🍝",
    "type": "single_dish",
    "bg": "bg-yellow-100"
  },
  {
    "id": 9,
    "name": "ข้าวหมูแดง",
    "detail": "250 กรัม (430 กิโลแคลอรี)",
    "carb": 4,
    "emoji": "🍛",
    "type": "single_dish",
    "bg": "bg-yellow-100"
  },
  {
    "id": 10,
    "name": "ข้าวมันไก่",
    "detail": "245 กรัม (380 กิโลแคลอรี)",
    "carb": 2.3,
    "emoji": "🍛",
    "type": "single_dish",
    "bg": "bg-yellow-100"
  },
  {
    "id": 11,
    "name": "ข้าวผัดหมูใส่ไข่",
    "detail": "270 กรัม (525 กิโลแคลอรี)",
    "carb": 3.15,
    "emoji": "🍛",
    "type": "single_dish",
    "bg": "bg-yellow-100"
  },
  {
    "id": 12,
    "name": "ข้าวกะเพราหมูสับใส่ไข่ดาว",
    "detail": "270 กรัม (525 กิโลแคลอรี)",
    "carb": 3.15,
    "emoji": "🍛",
    "type": "single_dish",
    "bg": "bg-yellow-100"
  },
  {
    "id": 13,
    "name": "ข้าวขาหมู",
    "detail": "246 กรัม (500 กิโลแคลอรี)",
    "carb": 3.3,
    "emoji": "🍛",
    "type": "single_dish",
    "bg": "bg-yellow-100"
  },
  {
    "id": 14,
    "name": "สปาเก็ตตี้คาโบนาร่า",
    "detail": "210 กรัม (350 กิโลแคลอรี)",
    "carb": 2.3,
    "emoji": "🍝",
    "type": "single_dish",
    "bg": "bg-yellow-100"
  },
  {
    "id": 15,
    "name": "ก๋วยจั๊บ",
    "detail": "645 กรัม (490 กิโลแคลอรี)",
    "carb": 2.3,
    "emoji": "🍜",
    "type": "single_dish",
    "bg": "bg-yellow-100"
  },
  {
    "id": 16,
    "name": "กล้วยแขก",
    "detail": "20 กรัม (1 ชิ้น)",
    "carb": 1,
    "emoji": "🍌",
    "type": "dessert_bakery",
    "bg": "bg-pink-100"
  },
  {
    "id": 17,
    "name": "ขนมกล้วย",
    "detail": "50 กรัม (1 ชิ้น)",
    "carb": 1.5,
    "emoji": "🍌",
    "type": "dessert_bakery",
    "bg": "bg-pink-100"
  },
  {
    "id": 18,
    "name": "ขนมครก",
    "detail": "90 กรัม (3 คู่)",
    "carb": 3,
    "emoji": "🥞",
    "type": "dessert_bakery",
    "bg": "bg-pink-100"
  },
  {
    "id": 19,
    "name": "ขนมชั้น",
    "detail": "1 ชิ้น",
    "carb": 1.7,
    "emoji": "🍮",
    "type": "dessert_bakery",
    "bg": "bg-pink-100"
  },
  {
    "id": 20,
    "name": "ขนมตาล",
    "detail": "30 กรัม (1 ชิ้น)",
    "carb": 1,
    "emoji": "🥮",
    "type": "dessert_bakery",
    "bg": "bg-pink-100"
  },
  {
    "id": 21,
    "name": "ขนมถังแตก",
    "detail": "1 ชิ้น",
    "carb": 4,
    "emoji": "🥞",
    "type": "dessert_bakery",
    "bg": "bg-pink-100"
  },
  {
    "id": 22,
    "name": "ขนมบัวลอยเผือก",
    "detail": "100 กรัม (1/2 ถ้วยตวง)",
    "carb": 2,
    "emoji": "🥣",
    "type": "dessert_bakery",
    "bg": "bg-pink-100"
  },
  {
    "id": 23,
    "name": "ขนมบ้าบิ่น",
    "detail": "100 กรัม (5 ชิ้น)",
    "carb": 4,
    "emoji": "🥞",
    "type": "dessert_bakery",
    "bg": "bg-pink-100"
  },
  {
    "id": 24,
    "name": "ขนมเบื้องครีมไส้เค็ม",
    "detail": "30 กรัม (6 ชิ้น)",
    "carb": 1.5,
    "emoji": "🌮",
    "type": "dessert_bakery",
    "bg": "bg-pink-100"
  },
  {
    "id": 25,
    "name": "ขนมปากหม้อ",
    "detail": "48 กรัม (4 ชิ้น)",
    "carb": 1,
    "emoji": "🥟",
    "type": "dessert_bakery",
    "bg": "bg-pink-100"
  },
  {
    "id": 26,
    "name": "ขนมลอดช่องน้ำกะทิ",
    "detail": "100 กรัม (1/2 ถ้วยตวง)",
    "carb": 1.5,
    "emoji": "🍧",
    "type": "dessert_bakery",
    "bg": "bg-pink-100"
  },
  {
    "id": 27,
    "name": "ขนมลูกชุบ",
    "detail": "35 กรัม (4 ชิ้น)",
    "carb": 1,
    "emoji": "🍡",
    "type": "dessert_bakery",
    "bg": "bg-pink-100"
  },
  {
    "id": 28,
    "name": "ขนมสาคูไส้หมู",
    "detail": "48 กรัม (4 ลูก)",
    "carb": 1,
    "emoji": "🥟",
    "type": "dessert_bakery",
    "bg": "bg-pink-100"
  },
  {
    "id": 29,
    "name": "ขนมใส่ไส้",
    "detail": "55 กรัม (1 ชิ้น)",
    "carb": 1,
    "emoji": "🫔",
    "type": "dessert_bakery",
    "bg": "bg-pink-100"
  },
  {
    "id": 30,
    "name": "ข้าวต้มมัดไส้กล้วย",
    "detail": "70 กรัม (1 กลีบ)",
    "carb": 2,
    "emoji": "🫔",
    "type": "dessert_bakery",
    "bg": "bg-pink-100"
  },
  {
    "id": 31,
    "name": "ข้าวเหนียวปิ้งไส้กล้วย",
    "detail": "85 กรัม (1 ชิ้น)",
    "carb": 2.5,
    "emoji": "🫔",
    "type": "dessert_bakery",
    "bg": "bg-pink-100"
  },
  {
    "id": 32,
    "name": "ข้าวเหนียวมูล",
    "detail": "15 กรัม (1 ช้อนโต๊ะ)",
    "carb": 0.5,
    "emoji": "🍚",
    "type": "dessert_bakery",
    "bg": "bg-pink-100"
  },
  {
    "id": 33,
    "name": "เฉาก๊วยในน้ำเชื่อม",
    "detail": "160 กรัม (1 ถุง)",
    "carb": 4,
    "emoji": "🍧",
    "type": "dessert_bakery",
    "bg": "bg-pink-100"
  },
  {
    "id": 34,
    "name": "ซาหริ่ม",
    "detail": "100 กรัม (1/2 ถ้วย)",
    "carb": 2,
    "emoji": "🍧",
    "type": "dessert_bakery",
    "bg": "bg-pink-100"
  },
  {
    "id": 35,
    "name": "เต้าทึง",
    "detail": "200 กรัม (1 ถ้วยตวง)",
    "carb": 3,
    "emoji": "🥣",
    "type": "dessert_bakery",
    "bg": "bg-pink-100"
  },
  {
    "id": 36,
    "name": "ทองม้วน",
    "detail": "14 กรัม (4 ชิ้นกลม)",
    "carb": 1,
    "emoji": "🫔",
    "type": "dessert_bakery",
    "bg": "bg-pink-100"
  },
  {
    "id": 37,
    "name": "ทุเรียนทอดอบกรอบ",
    "detail": "30 กรัม (1/2 ถ้วยตวง)",
    "carb": 1,
    "emoji": "🍘",
    "type": "dessert_bakery",
    "bg": "bg-pink-100"
  },
  {
    "id": 38,
    "name": "บะจ่าง",
    "detail": "180 กรัม (1 ชิ้น)",
    "carb": 4,
    "emoji": "🍙",
    "type": "dessert_bakery",
    "bg": "bg-pink-100"
  },
  {
    "id": 39,
    "name": "บัวลอยน้ำขิง",
    "detail": "200 กรัม (1 ถ้วยตวง)",
    "carb": 2.5,
    "emoji": "🥣",
    "type": "dessert_bakery",
    "bg": "bg-pink-100"
  },
  {
    "id": 40,
    "name": "ปาท่องโก๋",
    "detail": "20 กรัม (1 คู่)",
    "carb": 0.5,
    "emoji": "🥖",
    "type": "dessert_bakery",
    "bg": "bg-pink-100"
  },
  {
    "id": 41,
    "name": "ขนมปังกรอบ (เนย+น้ำตาล)",
    "detail": "30 กรัม (3 ชิ้น)",
    "carb": 1,
    "emoji": "🍞",
    "type": "dessert_bakery",
    "bg": "bg-pink-100"
  },
  {
    "id": 42,
    "name": "ขนมปังขาไก่รสต่างๆ",
    "detail": "25-30 กรัม (1/3 ถ้วยตวง)",
    "carb": 1,
    "emoji": "🥖",
    "type": "dessert_bakery",
    "bg": "bg-pink-100"
  },
  {
    "id": 43,
    "name": "ขนมปังเนยสด",
    "detail": "50 กรัม (1 ชิ้น)",
    "carb": 1.7,
    "emoji": "🍞",
    "type": "dessert_bakery",
    "bg": "bg-pink-100"
  },
  {
    "id": 44,
    "name": "คัพเค้กแต่งหน้า",
    "detail": "1 ถ้วยเล็ก",
    "carb": 2,
    "emoji": "🧁",
    "type": "dessert_bakery",
    "bg": "bg-pink-100"
  },
  {
    "id": 45,
    "name": "คุกกี้เนย",
    "detail": "15 กรัม (3 ชิ้น)",
    "carb": 0.7,
    "emoji": "🍪",
    "type": "dessert_bakery",
    "bg": "bg-pink-100"
  },
  {
    "id": 46,
    "name": "คุกกี้ผสมช็อกโกแลตชิพ",
    "detail": "40 กรัม (3 ชิ้น)",
    "carb": 2,
    "emoji": "🍪",
    "type": "dessert_bakery",
    "bg": "bg-pink-100"
  },
  {
    "id": 47,
    "name": "เค้กกล้วยหอม (สี่เหลี่ยม)",
    "detail": "80 กรัม (1 ชิ้น)",
    "carb": 2.5,
    "emoji": "🍰",
    "type": "dessert_bakery",
    "bg": "bg-pink-100"
  },
  {
    "id": 48,
    "name": "เค้กชิฟฟอน",
    "detail": "30 กรัม (1 ชิ้น)",
    "carb": 1,
    "emoji": "🍰",
    "type": "dessert_bakery",
    "bg": "bg-pink-100"
  },
  {
    "id": 49,
    "name": "เค้กเนย",
    "detail": "40 กรัม (1 ชิ้น)",
    "carb": 1,
    "emoji": "🍰",
    "type": "dessert_bakery",
    "bg": "bg-pink-100"
  },
  {
    "id": 50,
    "name": "เค้กผลไม้",
    "detail": "30 กรัม (1 ชิ้น)",
    "carb": 1,
    "emoji": "🍰",
    "type": "dessert_bakery",
    "bg": "bg-pink-100"
  },
  {
    "id": 51,
    "name": "เค้กไม่เคลือบน้ำตาล",
    "detail": "1 ชิ้น",
    "carb": 1,
    "emoji": "🍰",
    "type": "dessert_bakery",
    "bg": "bg-pink-100"
  },
  {
    "id": 52,
    "name": "เจลาติน (เจลโล)",
    "detail": "1/2 ถ้วยตวง",
    "carb": 1,
    "emoji": "🍮",
    "type": "dessert_bakery",
    "bg": "bg-pink-100"
  },
  {
    "id": 53,
    "name": "ซาลาเปาไส้ครีม (กลาง)",
    "detail": "80 กรัม (1 ลูก)",
    "carb": 1.7,
    "emoji": "🥟",
    "type": "dessert_bakery",
    "bg": "bg-pink-100"
  },
  {
    "id": 54,
    "name": "ซาลาเปาไส้หมูสับ (กลาง)",
    "detail": "55 กรัม (1 ลูก)",
    "carb": 1.3,
    "emoji": "🥟",
    "type": "dessert_bakery",
    "bg": "bg-pink-100"
  },
  {
    "id": 55,
    "name": "เดนิส (ชีส)",
    "detail": "100 กรัม (1 ชิ้น)",
    "carb": 2.5,
    "emoji": "🥐",
    "type": "dessert_bakery",
    "bg": "bg-pink-100"
  },
  {
    "id": 56,
    "name": "โดนัทพอนเดอริงเกรช",
    "detail": "1 ชิ้น",
    "carb": 2,
    "emoji": "🍩",
    "type": "dessert_bakery",
    "bg": "bg-pink-100"
  },
  {
    "id": 57,
    "name": "บราวนี่ ไม่เคลือบน้ำตาล",
    "detail": "1 ชิ้นเล็ก",
    "carb": 1,
    "emoji": "🥮",
    "type": "dessert_bakery",
    "bg": "bg-pink-100"
  },
  {
    "id": 58,
    "name": "พายไก่ (ขนาดกลาง)",
    "detail": "85 กรัม (1 ชิ้น)",
    "carb": 1,
    "emoji": "🥧",
    "type": "dessert_bakery",
    "bg": "bg-pink-100"
  },
  {
    "id": 59,
    "name": "พายผลไม้",
    "detail": "70 - 80 กรัม (1 ชิ้น)",
    "carb": 1.5,
    "emoji": "🥧",
    "type": "dessert_bakery",
    "bg": "bg-pink-100"
  },
  {
    "id": 60,
    "name": "แพนเค้ก",
    "detail": "50 กรัม",
    "carb": 1,
    "emoji": "🥞",
    "type": "dessert_bakery",
    "bg": "bg-pink-100"
  },
  {
    "id": 61,
    "name": "มัชกิ้นโดนัท",
    "detail": "1 ชิ้น",
    "carb": 0.5,
    "emoji": "🍩",
    "type": "dessert_bakery",
    "bg": "bg-pink-100"
  },
  {
    "id": 62,
    "name": "วาฟเฟิล",
    "detail": "1 ชิ้น",
    "carb": 1.3,
    "emoji": "🧇",
    "type": "dessert_bakery",
    "bg": "bg-pink-100"
  },
  {
    "id": 63,
    "name": "เอแคร์ ไส้ครีม",
    "detail": "60 กรัม (4 ลูก)",
    "carb": 1,
    "emoji": "🥮",
    "type": "dessert_bakery",
    "bg": "bg-pink-100"
  },
  {
    "id": 64,
    "name": "โอริโอสอดไส้ครีม",
    "detail": "30 กรัม (3 ชิ้น)",
    "carb": 1.3,
    "emoji": "🍪",
    "type": "dessert_bakery",
    "bg": "bg-pink-100"
  },
  {
    "id": 65,
    "name": "ไอศกรีม",
    "detail": "1/2 ถ้วยตวง",
    "carb": 1,
    "emoji": "🍦",
    "type": "dessert_bakery",
    "bg": "bg-pink-100"
  },
  {
    "id": 66,
    "name": "นมข้นจืดไขมัน 2% (เสริมวิตามินเอและดี)",
    "detail": "120 มล. (1/2 ถต.)",
    "carb": 1.3,
    "emoji": "🥛",
    "type": "dairy",
    "bg": "bg-blue-100"
  },
  {
    "id": 67,
    "name": "นมไขมัน 1%",
    "detail": "240 มล. (1 แก้ว)",
    "carb": 1,
    "emoji": "🥛",
    "type": "dairy",
    "bg": "bg-blue-100"
  },
  {
    "id": 68,
    "name": "นมไขมัน 2%",
    "detail": "240 มล. (1 แก้ว)",
    "carb": 1,
    "emoji": "🥛",
    "type": "dairy",
    "bg": "bg-blue-100"
  },
  {
    "id": 69,
    "name": "นมไขมัน 2% (ผสมนมขาดมันเนย)",
    "detail": "240 มล. (1 แก้ว)",
    "carb": 1,
    "emoji": "🥛",
    "type": "dairy",
    "bg": "bg-blue-100"
  },
  {
    "id": 70,
    "name": "นมควาย",
    "detail": "240 มล. (1 แก้ว)",
    "carb": 0.7,
    "emoji": "🥛",
    "type": "dairy",
    "bg": "bg-blue-100"
  },
  {
    "id": 71,
    "name": "นมคืนรูป UHT รสจืด",
    "detail": "200 มล.",
    "carb": 1,
    "emoji": "🧃",
    "type": "dairy",
    "bg": "bg-blue-100"
  },
  {
    "id": 72,
    "name": "นมคืนรูป UHT รสหวาน",
    "detail": "200 มล.",
    "carb": 1,
    "emoji": "🧃",
    "type": "dairy",
    "bg": "bg-blue-100"
  },
  {
    "id": 73,
    "name": "นมแพะ UHT",
    "detail": "190 มล. (1 กล่อง)",
    "carb": 0.5,
    "emoji": "🧃",
    "type": "dairy",
    "bg": "bg-blue-100"
  },
  {
    "id": 74,
    "name": "นมข้นหวาน",
    "detail": "20 กรัม (1 ชต.)",
    "carb": 0.7,
    "emoji": "🥫",
    "type": "dairy",
    "bg": "bg-blue-100"
  },
  {
    "id": 75,
    "name": "นมผง (ฟูลครีม)",
    "detail": "30 กรัม (4 ชต.)",
    "carb": 0.7,
    "emoji": "🥄",
    "type": "dairy",
    "bg": "bg-blue-100"
  },
  {
    "id": 76,
    "name": "นมผงขาดมันเนย",
    "detail": "30 กรัม (4 ชต.)",
    "carb": 1,
    "emoji": "🥄",
    "type": "dairy",
    "bg": "bg-blue-100"
  },
  {
    "id": 77,
    "name": "นมผงพร่องมันเนย (เสริมแคลเซียม)",
    "detail": "30 กรัม (4 ชต.)",
    "carb": 1,
    "emoji": "🥄",
    "type": "dairy",
    "bg": "bg-blue-100"
  },
  {
    "id": 78,
    "name": "นมระเหยหรือนมข้นจืด",
    "detail": "120 มล. (1/2 ถต.)",
    "carb": 0.7,
    "emoji": "🥫",
    "type": "dairy",
    "bg": "bg-blue-100"
  },
  {
    "id": 79,
    "name": "นมสดจืดขาดมันเนย",
    "detail": "200 มล. (1 ขวด)",
    "carb": 1,
    "emoji": "🥛",
    "type": "dairy",
    "bg": "bg-blue-100"
  },
  {
    "id": 80,
    "name": "นมสดจืดไขมันเต็มส่วน (นมครบส่วน)",
    "detail": "240 มล. (1 แก้ว)",
    "carb": 1,
    "emoji": "🥛",
    "type": "dairy",
    "bg": "bg-blue-100"
  },
  {
    "id": 81,
    "name": "นมสดจืดพร่องมันเนย",
    "detail": "240 มล. (1 แก้ว)",
    "carb": 1,
    "emoji": "🥛",
    "type": "dairy",
    "bg": "bg-blue-100"
  },
  {
    "id": 82,
    "name": "นมจืดสเตอริไลส์",
    "detail": "140 มล. (1 กระป๋อง)",
    "carb": 0.5,
    "emoji": "🥫",
    "type": "dairy",
    "bg": "bg-blue-100"
  },
  {
    "id": 83,
    "name": "นมจืดสเตอริไลส์พร่องมันเนย",
    "detail": "140 มล. (1 กระป๋อง)",
    "carb": 0.5,
    "emoji": "🥫",
    "type": "dairy",
    "bg": "bg-blue-100"
  },
  {
    "id": 84,
    "name": "โยเกิร์ต 0 % ไขมัน (รสธรรมชาติ)",
    "detail": "110 กรัม (1 ถ้วยเล็ก)",
    "carb": 1,
    "emoji": "🥣",
    "type": "dairy",
    "bg": "bg-blue-100"
  },
  {
    "id": 85,
    "name": "โยเกิร์ตไขมันต่ำ (รสธรรมชาติ)",
    "detail": "110 กรัม (1 ถ้วยเล็ก)",
    "carb": 1,
    "emoji": "🥣",
    "type": "dairy",
    "bg": "bg-blue-100"
  },
  {
    "id": 86,
    "name": "หน่อไม้ฝรั่ง",
    "detail": "1 ทัพพี",
    "carb": 0.3,
    "emoji": "🌿",
    "type": "vegetable",
    "bg": "bg-teal-100"
  },
  {
    "id": 87,
    "name": "สะตอ",
    "detail": "1 ทัพพี",
    "carb": 0.3,
    "emoji": "🫘",
    "type": "vegetable",
    "bg": "bg-teal-100"
  },
  {
    "id": 88,
    "name": "ดอกกะหล่ำ",
    "detail": "1 ทัพพี",
    "carb": 0.3,
    "emoji": "🥦",
    "type": "vegetable",
    "bg": "bg-teal-100"
  },
  {
    "id": 89,
    "name": "แครอท",
    "detail": "1 ทัพพี",
    "carb": 0.3,
    "emoji": "🥕",
    "type": "vegetable",
    "bg": "bg-teal-100"
  },
  {
    "id": 90,
    "name": "ถั่วลันเตา (ฝัก) / ถั่วลันเตาหวาน",
    "detail": "1 ทัพพี",
    "carb": 0.3,
    "emoji": "🫛",
    "type": "vegetable",
    "bg": "bg-teal-100"
  },
  {
    "id": 91,
    "name": "ถั่วงอกหัวโต",
    "detail": "1 ทัพพี",
    "carb": 0.3,
    "emoji": "🌱",
    "type": "vegetable",
    "bg": "bg-teal-100"
  },
  {
    "id": 92,
    "name": "มะเขือเปราะ",
    "detail": "1 ทัพพี",
    "carb": 0.3,
    "emoji": "🍆",
    "type": "vegetable",
    "bg": "bg-teal-100"
  },
  {
    "id": 93,
    "name": "ถั่วฝักยาว",
    "detail": "1 ทัพพี",
    "carb": 0.3,
    "emoji": "🫘",
    "type": "vegetable",
    "bg": "bg-teal-100"
  },
  {
    "id": 94,
    "name": "บร็อคโคลี",
    "detail": "1 ทัพพี",
    "carb": 0.3,
    "emoji": "🥦",
    "type": "vegetable",
    "bg": "bg-teal-100"
  },
  {
    "id": 95,
    "name": "กะหล่ำปลี",
    "detail": "1 ทัพพี",
    "carb": 0.3,
    "emoji": "🥬",
    "type": "vegetable",
    "bg": "bg-teal-100"
  },
  {
    "id": 96,
    "name": "มะละกอดิบ",
    "detail": "1 ทัพพี",
    "carb": 0.3,
    "emoji": "🥗",
    "type": "vegetable",
    "bg": "bg-teal-100"
  },
  {
    "id": 97,
    "name": "ข้าวโพดอ่อน",
    "detail": "1 ทัพพี",
    "carb": 0.3,
    "emoji": "🌽",
    "type": "vegetable",
    "bg": "bg-teal-100"
  },
  {
    "id": 98,
    "name": "ผักคะน้า",
    "detail": "1 ทัพพี",
    "carb": 0.3,
    "emoji": "🥬",
    "type": "vegetable",
    "bg": "bg-teal-100"
  },
  {
    "id": 99,
    "name": "แขนงคะน้า",
    "detail": "1 ทัพพี",
    "carb": 0.3,
    "emoji": "🥬",
    "type": "vegetable",
    "bg": "bg-teal-100"
  },
  {
    "id": 100,
    "name": "ดอกแค",
    "detail": "1 ทัพพี",
    "carb": 0.3,
    "emoji": "🌼",
    "type": "vegetable",
    "bg": "bg-teal-100"
  },
  {
    "id": 101,
    "name": "คะน้าฮ่องกง (บร็อคโคลีจีน)",
    "detail": "1 ทัพพี",
    "carb": 0.3,
    "emoji": "🥬",
    "type": "vegetable",
    "bg": "bg-teal-100"
  },
  {
    "id": 102,
    "name": "กระเจี๊ยบ (ผล)",
    "detail": "1 ทัพพี",
    "carb": 0.3,
    "emoji": "🥒",
    "type": "vegetable",
    "bg": "bg-teal-100"
  },
  {
    "id": 103,
    "name": "มะระ",
    "detail": "1 ทัพพี",
    "carb": 0.3,
    "emoji": "🥒",
    "type": "vegetable",
    "bg": "bg-teal-100"
  },
  {
    "id": 104,
    "name": "หัวปลี",
    "detail": "1 ทัพพี",
    "carb": 0.3,
    "emoji": "🌺",
    "type": "vegetable",
    "bg": "bg-teal-100"
  },
  {
    "id": 105,
    "name": "ขนุนอ่อน",
    "detail": "1 ทัพพี",
    "carb": 0.3,
    "emoji": "🍈",
    "type": "vegetable",
    "bg": "bg-teal-100"
  },
  {
    "id": 106,
    "name": "กล้วยน้ำว้า",
    "detail": "45 กรัม (1 ผล)",
    "carb": 1,
    "emoji": "🍌",
    "type": "fruit",
    "bg": "bg-green-100"
  },
  {
    "id": 107,
    "name": "กล้วยหอม ขนาด 9 นิ้ว",
    "detail": "50 กรัม (1/2 ผลกลาง)",
    "carb": 1,
    "emoji": "🍌",
    "type": "fruit",
    "bg": "bg-green-100"
  },
  {
    "id": 108,
    "name": "กีวี",
    "detail": "120 กรัม (1 ผล)",
    "carb": 1,
    "emoji": "🥝",
    "type": "fruit",
    "bg": "bg-green-100"
  },
  {
    "id": 109,
    "name": "แก้วมังกร",
    "detail": "120 กรัม (1/2 ผลกลาง หรือ 8 ชิ้นคำ)",
    "carb": 1,
    "emoji": "🍉",
    "type": "fruit",
    "bg": "bg-green-100"
  },
  {
    "id": 110,
    "name": "ขนุน",
    "detail": "60 กรัม (3 ยวง)",
    "carb": 1,
    "emoji": "🍈",
    "type": "fruit",
    "bg": "bg-green-100"
  },
  {
    "id": 111,
    "name": "แคนตาลูป",
    "detail": "185 กรัม (8 ชิ้นคำ)",
    "carb": 1,
    "emoji": "🍈",
    "type": "fruit",
    "bg": "bg-green-100"
  },
  {
    "id": 112,
    "name": "เงาะ",
    "detail": "100 กรัม (4 ผล)",
    "carb": 1,
    "emoji": "🍒",
    "type": "fruit",
    "bg": "bg-green-100"
  },
  {
    "id": 113,
    "name": "ชมพู่เมืองเพชร",
    "detail": "230 กรัม (3 ผลกลาง)",
    "carb": 1,
    "emoji": "🍎",
    "type": "fruit",
    "bg": "bg-green-100"
  },
  {
    "id": 114,
    "name": "เชอรี่",
    "detail": "45 กรัม (12 ผล)",
    "carb": 1,
    "emoji": "🍒",
    "type": "fruit",
    "bg": "bg-green-100"
  },
  {
    "id": 115,
    "name": "แตงไทย",
    "detail": "470 กรัม (20 ชิ้นคำ)",
    "carb": 1,
    "emoji": "🍈",
    "type": "fruit",
    "bg": "bg-green-100"
  },
  {
    "id": 116,
    "name": "แตงโม",
    "detail": "285 กรัม (8 ชิ้นคำ)",
    "carb": 1,
    "emoji": "🍉",
    "type": "fruit",
    "bg": "bg-green-100"
  },
  {
    "id": 117,
    "name": "ทุเรียน",
    "detail": "50 กรัม (1 เม็ดเล็ก)",
    "carb": 1,
    "emoji": "🍈",
    "type": "fruit",
    "bg": "bg-green-100"
  },
  {
    "id": 118,
    "name": "น้อยหน่า",
    "detail": "70 กรัม (1/2 ผล)",
    "carb": 1,
    "emoji": "🍏",
    "type": "fruit",
    "bg": "bg-green-100"
  },
  {
    "id": 119,
    "name": "ฝรั่ง",
    "detail": "125 กรัม (1 ผลเล็ก หรือ 1/2 ผลกลาง)",
    "carb": 1,
    "emoji": "🍐",
    "type": "fruit",
    "bg": "bg-green-100"
  },
  {
    "id": 120,
    "name": "พรุน",
    "detail": "60 กรัม (3 ผล)",
    "carb": 1,
    "emoji": "🫐",
    "type": "fruit",
    "bg": "bg-green-100"
  },
  {
    "id": 121,
    "name": "พีชสด",
    "detail": "230 กรัม (1 ผลกลาง)",
    "carb": 1,
    "emoji": "🍑",
    "type": "fruit",
    "bg": "bg-green-100"
  },
  {
    "id": 122,
    "name": "พุทราไทย",
    "detail": "80 กรัม (5 ผลกลาง)",
    "carb": 1,
    "emoji": "🍏",
    "type": "fruit",
    "bg": "bg-green-100"
  },
  {
    "id": 123,
    "name": "มะกอกฝรั่ง",
    "detail": "135 กรัม (3 ผล)",
    "carb": 1,
    "emoji": "🫒",
    "type": "fruit",
    "bg": "bg-green-100"
  },
  {
    "id": 124,
    "name": "มะขามเทศ",
    "detail": "80 กรัม (3 ฝัก)",
    "carb": 1,
    "emoji": "🫘",
    "type": "fruit",
    "bg": "bg-green-100"
  },
  {
    "id": 125,
    "name": "มะขามหวาน",
    "detail": "20 กรัม (1 - 2 ฝักใหญ่)",
    "carb": 1,
    "emoji": "🫘",
    "type": "fruit",
    "bg": "bg-green-100"
  },
  {
    "id": 126,
    "name": "มะปราง",
    "detail": "120 กรัม (2 ผลกลาง)",
    "carb": 1,
    "emoji": "🥭",
    "type": "fruit",
    "bg": "bg-green-100"
  },
  {
    "id": 127,
    "name": "มะเฟือง",
    "detail": "170 กรัม (1 ผล)",
    "carb": 1,
    "emoji": "🍋",
    "type": "fruit",
    "bg": "bg-green-100"
  },
  {
    "id": 128,
    "name": "มะไฟ",
    "detail": "145 กรัม (15 ผล)",
    "carb": 1,
    "emoji": "🍒",
    "type": "fruit",
    "bg": "bg-green-100"
  },
  {
    "id": 129,
    "name": "มะม่วงดิบ",
    "detail": "135 กรัม (1/2 ผลกลาง)",
    "carb": 1,
    "emoji": "🥭",
    "type": "fruit",
    "bg": "bg-green-100"
  },
  {
    "id": 130,
    "name": "มะม่วงสุก",
    "detail": "80 กรัม (1/2 ผลเล็ก)",
    "carb": 1,
    "emoji": "🥭",
    "type": "fruit",
    "bg": "bg-green-100"
  },
  {
    "id": 131,
    "name": "มะยงชิด",
    "detail": "100 กรัม (2 ผล)",
    "carb": 1,
    "emoji": "🥭",
    "type": "fruit",
    "bg": "bg-green-100"
  },
  {
    "id": 132,
    "name": "มะละกอสุก",
    "detail": "115 กรัม (8 ชิ้นคำ)",
    "carb": 1,
    "emoji": "🥭",
    "type": "fruit",
    "bg": "bg-green-100"
  },
  {
    "id": 133,
    "name": "มังคุด",
    "detail": "75 กรัม (4 ผล)",
    "carb": 1,
    "emoji": "🫐",
    "type": "fruit",
    "bg": "bg-green-100"
  },
  {
    "id": 134,
    "name": "ระกำ",
    "detail": "110 กรัม (6 ผล)",
    "carb": 1,
    "emoji": "🍓",
    "type": "fruit",
    "bg": "bg-green-100"
  },
  {
    "id": 135,
    "name": "ลองกอง",
    "detail": "90 กรัม (6 - 8 ผล)",
    "carb": 1,
    "emoji": "🍇",
    "type": "fruit",
    "bg": "bg-green-100"
  },
  {
    "id": 136,
    "name": "ละมุด",
    "detail": "70 กรัม (1 ผล)",
    "carb": 1,
    "emoji": "🥔",
    "type": "fruit",
    "bg": "bg-green-100"
  },
  {
    "id": 137,
    "name": "ลางสาด",
    "detail": "100 กรัม (6 - 8 ผล)",
    "carb": 1,
    "emoji": "🍇",
    "type": "fruit",
    "bg": "bg-green-100"
  },
  {
    "id": 138,
    "name": "ลำไย",
    "detail": "80 กรัม (5 - 6 ผล)",
    "carb": 1,
    "emoji": "🍇",
    "type": "fruit",
    "bg": "bg-green-100"
  },
  {
    "id": 139,
    "name": "ลิ้นจี่ (ผลเล็ก)",
    "detail": "95 กรัม (6 ผล)",
    "carb": 1,
    "emoji": "🍒",
    "type": "fruit",
    "bg": "bg-green-100"
  },
  {
    "id": 140,
    "name": "ลิ้นจี่จักรพรรดิ",
    "detail": "100 กรัม (3 ผล)",
    "carb": 1,
    "emoji": "🍒",
    "type": "fruit",
    "bg": "bg-green-100"
  },
  {
    "id": 141,
    "name": "ลูกเกด",
    "detail": "20 กรัม (2 ช้อนโต๊ะ)",
    "carb": 1,
    "emoji": "🍇",
    "type": "fruit",
    "bg": "bg-green-100"
  },
  {
    "id": 142,
    "name": "ลูกตาลสด",
    "detail": "155 กรัม (3 ผล)",
    "carb": 1,
    "emoji": "🥥",
    "type": "fruit",
    "bg": "bg-green-100"
  },
  {
    "id": 143,
    "name": "ลูกพลับ",
    "detail": "120 กรัม (1/2 ผลใหญ่)",
    "carb": 1,
    "emoji": "🍑",
    "type": "fruit",
    "bg": "bg-green-100"
  },
  {
    "id": 144,
    "name": "ลูกหว้า",
    "detail": "110 กรัม (1 ถ้วยตวง)",
    "carb": 1,
    "emoji": "🍇",
    "type": "fruit",
    "bg": "bg-green-100"
  },
  {
    "id": 145,
    "name": "สตรอเบอรี",
    "detail": "175 กรัม (8 - 10 ผลเล็ก)",
    "carb": 1,
    "emoji": "🍓",
    "type": "fruit",
    "bg": "bg-green-100"
  },
  {
    "id": 146,
    "name": "ส้มเขียวหวาน",
    "detail": "150 กรัม (2 ผลกลาง)",
    "carb": 1,
    "emoji": "🍊",
    "type": "fruit",
    "bg": "bg-green-100"
  },
  {
    "id": 147,
    "name": "ส้มเช้ง",
    "detail": "120 กรัม (1 ผลใหญ่)",
    "carb": 1,
    "emoji": "🍊",
    "type": "fruit",
    "bg": "bg-green-100"
  },
  {
    "id": 148,
    "name": "ส้มสายน้ำผึ้ง",
    "detail": "125 กรัม (2 ผลเล็ก)",
    "carb": 1,
    "emoji": "🍊",
    "type": "fruit",
    "bg": "bg-green-100"
  },
  {
    "id": 149,
    "name": "ส้มโอทองดี",
    "detail": "120 กรัม (2 - 3 กลีบกลาง)",
    "carb": 1,
    "emoji": "🍊",
    "type": "fruit",
    "bg": "bg-green-100"
  },
  {
    "id": 150,
    "name": "สละ",
    "detail": "110 กรัม (6 ผล)",
    "carb": 1,
    "emoji": "🍓",
    "type": "fruit",
    "bg": "bg-green-100"
  },
  {
    "id": 151,
    "name": "สับปะรดสด",
    "detail": "125 กรัม (8 ชิ้นคำ)",
    "carb": 1,
    "emoji": "🍍",
    "type": "fruit",
    "bg": "bg-green-100"
  },
  {
    "id": 152,
    "name": "สาลี่หอม",
    "detail": "110 กรัม (1 ผล)",
    "carb": 1,
    "emoji": "🍐",
    "type": "fruit",
    "bg": "bg-green-100"
  },
  {
    "id": 153,
    "name": "องุ่นแดง (นอก)",
    "detail": "100 กรัม (17 ผลเล็ก หรือ 6 ผลใหญ่)",
    "carb": 1,
    "emoji": "🍇",
    "type": "fruit",
    "bg": "bg-green-100"
  },
  {
    "id": 154,
    "name": "อินทผลัมแห้ง",
    "detail": "20 กรัม (3 ผล)",
    "carb": 1,
    "emoji": "🫘",
    "type": "fruit",
    "bg": "bg-green-100"
  },
  {
    "id": 155,
    "name": "แอปเปิ้ล",
    "detail": "100 กรัม (1 ผลเล็ก)",
    "carb": 1,
    "emoji": "🍎",
    "type": "fruit",
    "bg": "bg-green-100"
  },
  {
    "id": 156,
    "name": "ข้าวซ้อมมือ (สวย) / ข้าวขาว (สวย)",
    "detail": "55 กรัม (1 ทัพพี)",
    "carb": 1,
    "emoji": "🍚",
    "type": "rice_grain_flour",
    "bg": "bg-orange-100"
  },
  {
    "id": 157,
    "name": "ข้าวเหนียว",
    "detail": "35 กรัม (1/2 ทัพพี)",
    "carb": 1,
    "emoji": "🍚",
    "type": "rice_grain_flour",
    "bg": "bg-orange-100"
  },
  {
    "id": 158,
    "name": "ข้าวต้ม",
    "detail": "150 - 170 กรัม (2 ทัพพี)",
    "carb": 1,
    "emoji": "🍚",
    "type": "rice_grain_flour",
    "bg": "bg-orange-100"
  },
  {
    "id": 159,
    "name": "โจ๊ก",
    "detail": "135 กรัม (2 ทัพพี)",
    "carb": 1,
    "emoji": "🥣",
    "type": "rice_grain_flour",
    "bg": "bg-orange-100"
  },
  {
    "id": 160,
    "name": "ควินัวสุก",
    "detail": "70 กรัม (1 ทัพพี)",
    "carb": 1,
    "emoji": "🥣",
    "type": "rice_grain_flour",
    "bg": "bg-orange-100"
  },
  {
    "id": 161,
    "name": "ข้าวโอ๊ต",
    "detail": "110 กรัม (1 ทัพพี)",
    "carb": 1,
    "emoji": "🥣",
    "type": "rice_grain_flour",
    "bg": "bg-orange-100"
  },
  {
    "id": 162,
    "name": "ลูกเดือยสุก",
    "detail": "65 กรัม (1 ทัพพี)",
    "carb": 1,
    "emoji": "🥣",
    "type": "rice_grain_flour",
    "bg": "bg-orange-100"
  },
  {
    "id": 163,
    "name": "มุสลี",
    "detail": "4 ช้อนโต๊ะ",
    "carb": 1,
    "emoji": "🥣",
    "type": "rice_grain_flour",
    "bg": "bg-orange-100"
  },
  {
    "id": 164,
    "name": "เส้นหมี่สุก / เส้นก๋วยเตี๋ยวสุก",
    "detail": "70 กรัม (1 ทัพพี)",
    "carb": 1,
    "emoji": "🍜",
    "type": "rice_grain_flour",
    "bg": "bg-orange-100"
  },
  {
    "id": 165,
    "name": "วุ้นเส้นลวก",
    "detail": "80 กรัม (1 ทัพพี)",
    "carb": 1,
    "emoji": "🍜",
    "type": "rice_grain_flour",
    "bg": "bg-orange-100"
  },
  {
    "id": 166,
    "name": "เส้นใหญ่ (ลวก)",
    "detail": "60 - 70 กรัม (1 ทัพพี)",
    "carb": 1,
    "emoji": "🍜",
    "type": "rice_grain_flour",
    "bg": "bg-orange-100"
  },
  {
    "id": 167,
    "name": "เส้นขนมจีน",
    "detail": "75 กรัม (1 จับ)",
    "carb": 1,
    "emoji": "🍜",
    "type": "rice_grain_flour",
    "bg": "bg-orange-100"
  },
  {
    "id": 168,
    "name": "เส้นก๋วยจั๊บสุก",
    "detail": "90 กรัม (1 ทัพพี)",
    "carb": 1,
    "emoji": "🍜",
    "type": "rice_grain_flour",
    "bg": "bg-orange-100"
  },
  {
    "id": 169,
    "name": "เส้นก๋วยจั๊บญวนสุก",
    "detail": "65 กรัม (1 ทัพพี)",
    "carb": 1,
    "emoji": "🍜",
    "type": "rice_grain_flour",
    "bg": "bg-orange-100"
  },
  {
    "id": 170,
    "name": "บะหมี่ (1/2 ก้อน) หรือ บะหมี่กึ่งสำเร็จรูป*",
    "detail": "40 - 50 กรัม (1 ทัพพี)",
    "carb": 1,
    "emoji": "🍜",
    "type": "rice_grain_flour",
    "bg": "bg-orange-100"
  },
  {
    "id": 171,
    "name": "บะหมี่ญี่ปุ่น (อุด้ง)",
    "detail": "75 กรัม (1 ทัพพี)",
    "carb": 1,
    "emoji": "🍜",
    "type": "rice_grain_flour",
    "bg": "bg-orange-100"
  },
  {
    "id": 172,
    "name": "พาสต้า",
    "detail": "70 กรัม (1 ทัพพี)",
    "carb": 1,
    "emoji": "🍝",
    "type": "rice_grain_flour",
    "bg": "bg-orange-100"
  },
  {
    "id": 173,
    "name": "มักกะโรนี (สุก)",
    "detail": "70 กรัม (1 ทัพพี)",
    "carb": 1,
    "emoji": "🍝",
    "type": "rice_grain_flour",
    "bg": "bg-orange-100"
  },
  {
    "id": 174,
    "name": "เผือก (ต้ม) / มัน (ต้ม)",
    "detail": "65 กรัม (1 ทัพพี)",
    "carb": 1,
    "emoji": "🍠",
    "type": "rice_grain_flour",
    "bg": "bg-orange-100"
  },
  {
    "id": 175,
    "name": "สาคูเม็ดเล็ก (สุก)",
    "detail": "100 กรัม (1 ทัพพี)",
    "carb": 1,
    "emoji": "🧋",
    "type": "rice_grain_flour",
    "bg": "bg-orange-100"
  },
  {
    "id": 176,
    "name": "สาคูเม็ดใหญ่ (สุก)",
    "detail": "75 กรัม (5 ช้อนโต๊ะ)",
    "carb": 1,
    "emoji": "🧋",
    "type": "rice_grain_flour",
    "bg": "bg-orange-100"
  },
  {
    "id": 177,
    "name": "ฟักทอง (สุก)",
    "detail": "70 - 100 กรัม (1 ทัพพี)",
    "carb": 1,
    "emoji": "🎃",
    "type": "rice_grain_flour",
    "bg": "bg-orange-100"
  },
  {
    "id": 178,
    "name": "มันฝรั่งทั้งเปลือก (ปิ้ง / เผา)",
    "detail": "90 กรัม (1/4 หัวใหญ่)",
    "carb": 1,
    "emoji": "🥔",
    "type": "rice_grain_flour",
    "bg": "bg-orange-100"
  },
  {
    "id": 179,
    "name": "มันฝรั่งบด",
    "detail": "100 กรัม (1/2 ถ้วยตวง)",
    "carb": 1,
    "emoji": "🥔",
    "type": "rice_grain_flour",
    "bg": "bg-orange-100"
  },
  {
    "id": 180,
    "name": "มันแกว",
    "detail": "195 กรัม (4 หัวเล็ก)",
    "carb": 1,
    "emoji": "🌰",
    "type": "rice_grain_flour",
    "bg": "bg-orange-100"
  },
  {
    "id": 181,
    "name": "แห้ว (สุก)",
    "detail": "100 กรัม (1/2 ถ้วยตวง)",
    "carb": 1,
    "emoji": "🌰",
    "type": "rice_grain_flour",
    "bg": "bg-orange-100"
  },
  {
    "id": 182,
    "name": "ข้าวโพด (สุก)",
    "detail": "65 กรัม (1/2 ฝักกลาง)",
    "carb": 1,
    "emoji": "🌽",
    "type": "rice_grain_flour",
    "bg": "bg-orange-100"
  },
  {
    "id": 183,
    "name": "แครกเกอร์แผ่นกลม",
    "detail": "25 กรัม (6 แผ่น)",
    "carb": 1,
    "emoji": "🍘",
    "type": "rice_grain_flour",
    "bg": "bg-orange-100"
  },
  {
    "id": 184,
    "name": "บิสกิต Ø 2 1/2 นิ้ว",
    "detail": "1 ชิ้น",
    "carb": 1,
    "emoji": "🍪",
    "type": "rice_grain_flour",
    "bg": "bg-orange-100"
  },
  {
    "id": 185,
    "name": "ขนมปังกรอบรูปสัตว์",
    "detail": "25 กรัม (8 ชิ้น)",
    "carb": 1,
    "emoji": "🍪",
    "type": "rice_grain_flour",
    "bg": "bg-orange-100"
  },
  {
    "id": 186,
    "name": "แป้งสาลี / แป้งทำขนม / แป้งมันสำปะหลัง",
    "detail": "3 ช้อนโต๊ะ",
    "carb": 1,
    "emoji": "🥡",
    "type": "rice_grain_flour",
    "bg": "bg-orange-100"
  },
  {
    "id": 187,
    "name": "เมล็ดเกาลัดจีนคั่ว",
    "detail": "30 กรัม (6 เม็ด)",
    "carb": 1,
    "emoji": "🌰",
    "type": "rice_grain_flour",
    "bg": "bg-orange-100"
  },
  {
    "id": 188,
    "name": "ซีเรียลไม่เคลือบน้ำตาล",
    "detail": "3/4 ถ้วยตวง",
    "carb": 1,
    "emoji": "🥣",
    "type": "rice_grain_flour",
    "bg": "bg-orange-100"
  },
  {
    "id": 189,
    "name": "ซีเรียลเคลือบน้ำตาล",
    "detail": "1/2 ถ้วยตวง",
    "carb": 1,
    "emoji": "🥣",
    "type": "rice_grain_flour",
    "bg": "bg-orange-100"
  },
  {
    "id": 190,
    "name": "ข้าวโพดคั่วไม่ใส่เนย",
    "detail": "20 กรัม (3 ถ้วยตวง)",
    "carb": 1,
    "emoji": "🍿",
    "type": "rice_grain_flour",
    "bg": "bg-orange-100"
  },
  {
    "id": 191,
    "name": "ขนมปังโฮลวีต / ขนมปังสีขาว",
    "detail": "25 กรัม (1 แผ่น)",
    "carb": 1,
    "emoji": "🍞",
    "type": "rice_grain_flour",
    "bg": "bg-orange-100"
  },
  {
    "id": 192,
    "name": "ขนมปังแฮมเบอร์เกอร์ / ฮอทด็อก",
    "detail": "28 กรัม (1/2 คู่)",
    "carb": 1,
    "emoji": "🍔",
    "type": "rice_grain_flour",
    "bg": "bg-orange-100"
  },
  {
    "id": 193,
    "name": "ขนมปังก้อนกลม (ดินเนอร์โรล)",
    "detail": "28 กรัม (1 ก้อน)",
    "carb": 1,
    "emoji": "🥐",
    "type": "rice_grain_flour",
    "bg": "bg-orange-100"
  },
  {
    "id": 194,
    "name": "ขนมปังเบเกิ้ล",
    "detail": "120 กรัม (1/4 ชิ้น)",
    "carb": 1,
    "emoji": "🥯",
    "type": "rice_grain_flour",
    "bg": "bg-orange-100"
  },
  {
    "id": 195,
    "name": "อิงลิชมัฟฟิน",
    "detail": "1/2 ชิ้น",
    "carb": 1,
    "emoji": "🧁",
    "type": "rice_grain_flour",
    "bg": "bg-orange-100"
  },
  {
    "id": 196,
    "name": "หมั่นโถว (ขนาดกลาง)",
    "detail": "2/3 ลูก",
    "carb": 1,
    "emoji": "🥟",
    "type": "rice_grain_flour",
    "bg": "bg-orange-100"
  },
  {
    "id": 197,
    "name": "ขนมปังพีต้า Ø 6 นิ้ว",
    "detail": "1/2 แผ่น",
    "carb": 1,
    "emoji": "🫓",
    "type": "rice_grain_flour",
    "bg": "bg-orange-100"
  },
  {
    "id": 198,
    "name": "ขนมปังนาน (Naan) ขนาด 8×2 นิ้ว",
    "detail": "1/4 แผ่น",
    "carb": 1,
    "emoji": "🫓",
    "type": "rice_grain_flour",
    "bg": "bg-orange-100"
  },
  {
    "id": 199,
    "name": "แป้งทาโก้ Ø 5 นิ้ว",
    "detail": "2 แผ่น",
    "carb": 1,
    "emoji": "🌮",
    "type": "rice_grain_flour",
    "bg": "bg-orange-100"
  },
  {
    "id": 200,
    "name": "แป้งตอร์ตีญ่า Ø 6 นิ้ว",
    "detail": "1 แผ่น",
    "carb": 1,
    "emoji": "🫓",
    "type": "rice_grain_flour",
    "bg": "bg-orange-100"
  },
  {
    "id": 201,
    "name": "แป้งข้าวโพดตอร์ตีญ่า Ø 6 นิ้ว",
    "detail": "1 แผ่น",
    "carb": 1,
    "emoji": "🫓",
    "type": "rice_grain_flour",
    "bg": "bg-orange-100"
  },
  {
    "id": 202,
    "name": "แป้งโรตีย่าง (จาปาตี) Ø 6 นิ้ว",
    "detail": "1 แผ่นเล็ก",
    "carb": 1,
    "emoji": "🫓",
    "type": "rice_grain_flour",
    "bg": "bg-orange-100"
  },
  {
    "id": 203,
    "name": "แป้งเปาะเปี๊ยะ",
    "detail": "1 แผ่น",
    "carb": 1,
    "emoji": "🥟",
    "type": "rice_grain_flour",
    "bg": "bg-orange-100"
  },
  {
    "id": 204,
    "name": "แผ่นปอเปี๊ยะญวน (ลุยสวน) Ø 22 ซม.*",
    "detail": "20 กรัม (2 แผ่น)",
    "carb": 1,
    "emoji": "🌯",
    "type": "rice_grain_flour",
    "bg": "bg-orange-100"
  },
  {
    "id": 205,
    "name": "แป้งเกี๊ยว",
    "detail": "30 กรัม (4 แผ่น)",
    "carb": 1,
    "emoji": "🥟",
    "type": "rice_grain_flour",
    "bg": "bg-orange-100"
  }
   ];

   const [query, setQuery] = useState('');
   const [selectedFoodId, setSelectedFoodId] = useState(foodItems[0]?.id ?? null);

   const selectedFood = useMemo(
      () => foodItems.find((item) => item.id === selectedFoodId) ?? null,
      [selectedFoodId]
   );

   const selectedCarb = selectedFood ? Number(selectedFood.carb) : 0;
   const canExchange = selectedCarb <= remainingCarb;
   const normalizedQuery = query.trim().toLowerCase();

   const searchResults = useMemo(() => {
      if (!normalizedQuery) {
         return foodItems.slice(0, 8);
      }

      return foodItems
         .filter((item) => {
            const target = `${item.name} ${item.detail}`.toLowerCase();
            return target.includes(normalizedQuery);
         })
         .slice(0, 10);
   }, [normalizedQuery]);

   const exchangeOptions = useMemo(() => {
      if (!selectedFood || !canExchange) {
         return [];
      }

      return foodItems
         .filter((item) => item.id !== selectedFood.id)
         .map((item) => {
            const diff = Math.abs(Number(item.carb) - selectedCarb);
            const sameTypeBonus = item.type === selectedFood.type ? 0 : 0.2;
            return { ...item, score: diff + sameTypeBonus };
         })
         .sort((a, b) => a.score - b.score)
         .slice(0, 4);
   }, [selectedFood, selectedCarb, canExchange]);

   const recommendedOptions = useMemo(() => {
      if (!selectedFood) {
         return [];
      }

      return foodItems
         .filter((item) => item.id !== selectedFood.id && Number(item.carb) <= remainingCarb)
         .map((item) => {
            const carbGap = Math.abs(Number(item.carb) - selectedCarb);
            const priority = carbGap + (item.type === selectedFood.type ? 0 : 0.4);
            return { ...item, priority };
         })
         .sort((a, b) => a.priority - b.priority)
         .slice(0, 6);
   }, [selectedFood, selectedCarb, remainingCarb]);

   const handleBack = () => {
      if (window.history.length > 1) {
         navigate(-1);
      } else {
         navigate('/home');
      }
   };
  return (
    <MobileLayout>
      {/* --- Header --- */}
      <div className="bg-white p-4 pt-safe-top flex items-center justify-between sticky top-0 z-10">
         <button onClick={handleBack} className="p-2 -ml-2 text-slate-800 hover:bg-slate-50 rounded-full">
            <ChevronLeft size={24} />
         </button>
         <h1 className="text-lg font-bold text-slate-800 text-center w-full">อัตราแลกเปลี่ยนคาร์บ</h1>
         <div className="w-10"></div>
      </div>

      {/* --- Scrollable Content --- */}
      <div className="flex-1 overflow-y-auto px-5 pb-32 space-y-6 pt-4 no-scrollbar bg-[#F8FAFC]">
        
        {/* 1. Daily Carb Overview */}
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-50">
           <div className="flex justify-between items-baseline mb-2">
              <h2 className="font-bold text-slate-800">ภาพรวมคาร์บประจำวัน</h2>
              <span className="text-xs font-bold text-[#6CD2D9] bg-cyan-50 px-2 py-1 rounded-lg">{dailyCarb.used.toFixed(1)} / {dailyCarb.limit.toFixed(1)} คาร์บ</span>
           </div>
           
           {/* Progress Bar */}
           <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden mb-4">
              <div
                 className="h-full bg-[#6CD2D9] rounded-full"
                 style={{ width: `${progressPercent}%` }}
              ></div>
           </div>

           {/* Info Pill */}
           <div className="bg-cyan-50 text-[#55BCC3] text-xs font-bold py-3 rounded-xl text-center flex items-center justify-center gap-2 px-3">
              เหลือวันนี้ {remainingCarb.toFixed(1)} คาร์บ | คาร์โบไฮเดรต 15 กรัม = 1 คาร์บ
           </div>
        </div>

        {/* 2. Food Exchange Calculator */}
        <div>
           <h2 className="font-bold text-slate-800 mb-3 px-1">แลกเปลี่ยนอาหาร</h2>
           
           {/* Search Input */}
           <div className="relative mb-4">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                 type="text" 
                 value={query}
                 onChange={(event) => setQuery(event.target.value)}
                 placeholder="เช่น ข้าวมันไก่, กล้วย, ผัดไทย"
                 className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-slate-100 text-slate-700 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-[#6CD2D9]"
              />
           </div>

           <div className="bg-white border border-slate-100 rounded-2xl p-3 mb-4 max-h-48 overflow-y-auto no-scrollbar">
              <p className="text-[11px] uppercase tracking-wide text-slate-400 font-semibold mb-2">ผลการค้นหา</p>
              <div className="space-y-2">
                 {searchResults.map((item) => (
                    <button
                       key={item.id}
                       onClick={() => {
                          setSelectedFoodId(item.id);
                          setQuery(item.name);
                       }}
                       className={`w-full text-left flex items-center justify-between rounded-xl px-3 py-2 transition-colors ${
                          selectedFoodId === item.id ? 'bg-cyan-50' : 'hover:bg-slate-50'
                       }`}
                    >
                       <div className="flex items-center gap-3">
                          <span className="text-xl">{item.emoji}</span>
                          <div>
                             <p className="text-sm font-bold text-slate-700">{item.name}</p>
                             <p className="text-xs text-slate-400">{item.detail}</p>
                          </div>
                       </div>
                       <span className="text-xs font-bold text-[#55BCC3]">{Number(item.carb).toFixed(1)} คาร์บ</span>
                    </button>
                 ))}

                 {searchResults.length === 0 && (
                    <p className="text-xs text-slate-400 text-center py-3">ไม่พบเมนูที่ค้นหา</p>
                 )}
              </div>
           </div>

           {/* Swap Icon */}
           <div className="flex justify-center -my-2 relative z-10">
              <div className="bg-white p-2 rounded-full shadow-sm border border-slate-100 text-[#6CD2D9]">
                 <ArrowUpDown size={20} />
              </div>
           </div>

           {/* Result Box */}
           <div className="bg-slate-100 rounded-3xl p-5 pt-8 -mt-4">
              {selectedFood && (
                 <>
                    <p className="text-xs text-slate-500 font-medium mb-2 text-center">
                       เมนูที่เลือก <strong className="text-slate-800">{selectedFood.name}</strong>
                    </p>
                    <p className="text-xs text-slate-500 font-medium mb-4 text-center">
                       ใช้ <strong className="text-slate-800">{selectedCarb.toFixed(1)} คาร์บ</strong>
                    </p>
                 </>
              )}

              {!canExchange && selectedFood && (
                 <div className="bg-rose-50 text-rose-600 text-xs font-semibold py-3 px-3 rounded-xl text-center mb-3">
                    เมนูนี้ใช้ {selectedCarb.toFixed(1)} คาร์บ แต่วันนี้เหลือ {remainingCarb.toFixed(1)} คาร์บ จึงยังแลกไม่ได้
                 </div>
              )}
              
              {canExchange && exchangeOptions.length > 0 && (
                 <div className="grid grid-cols-2 gap-3">
                    {exchangeOptions.map((item) => (
                       <div key={item.id} className="bg-[#FFF9C4] p-4 rounded-xl border border-yellow-100 flex flex-col items-center justify-center text-center shadow-sm">
                          <span className="text-2xl mb-1">{item.emoji}</span>
                          <span className="text-xs font-bold text-slate-700 leading-tight">{item.name}</span>
                          <span className="text-[11px] text-slate-500 mt-1">{Number(item.carb).toFixed(1)} คาร์บ</span>
                       </div>
                    ))}
                 </div>
              )}
           </div>
        </div>

        {/* 3. Recommended Exchange Options */}
        <div>
           <h2 className="font-bold text-slate-800 mb-3 px-1">ตัวเลือกแลกเปลี่ยนแนะนำ</h2>
           <div className="grid grid-cols-2 gap-3">
              {recommendedOptions.map((item) => (
                 <RecommendationCard
                    key={item.id}
                    emoji={item.emoji}
                    name={item.name}
                    carbCount={`${Number(item.carb).toFixed(1)} คาร์บ`}
                    detail={item.detail}
                    disabled={!canExchange}
                 />
              ))}
           </div>

           {recommendedOptions.length === 0 && (
              <div className="bg-white border border-slate-100 rounded-2xl py-5 text-center text-xs text-slate-400">
                 ไม่มีเมนูแนะนำที่อยู่ในคาร์บคงเหลือ
              </div>
           )}
        </div>

      </div>

      {/* Bottom Nav (Active = exchange) */}
      <Navigation activePage="exchange" />
    </MobileLayout>
  );
};

// --- Sub-components ---
const RecommendationCard = ({ emoji, name, carbCount, detail, disabled }) => (
   <div className={`bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center py-6 ${disabled ? 'opacity-50' : ''}`}>
     <span className="text-4xl mb-3">{emoji}</span>
     <h3 className="font-bold text-slate-800 text-sm">{name}</h3>
     <p className="text-xs text-slate-400">{carbCount}</p>
       <p className="text-[11px] text-slate-400 mt-1 text-center">{detail}</p>
  </div>
);

export default CarbExchangePage;