# ชุดข้อสอบบทที่ 4: Intrusion Detection and Prevention Systems (IDPS) & Lab 5 (IDS)
**อ้างอิงเนื้อหา:** NIST SP 800-94, Week 10-11 Lecture & Lab 05 (IDS Snort / Suricata Rules & Architecture)

---

### ข้อที่ 1
ตามเอกสาร **NIST SP 800-94** ส่วนประกอบหลักของเทคโนโลยี IDPS ที่ทำหน้าที่ตรวจสอบและวิเคราะห์กิจกรรมบนเครือข่ายหรือโฮสต์ มีชื่อเรียกว่าอะไร?
A. Management Server  
B. Sensor หรือ Agent (Sensor ใช้กับ Network-based ส่วน Agent ใช้กับ Host-based)  
C. Database Server  
D. Console  
**เฉลย: B**  
**คำอธิบาย:** สถาปัตยกรรมทั่วไปของ IDPS ประกอบด้วย Sensor/Agent (ทำหน้าที่ดักจับและวิเคราะห์ข้อมูล), Management Server (ประมวลผล correlation และจัดการส่วนกลาง), Database Server (บันทึกเหตุการณ์), และ Console (หน้าจอ UI ให้ผู้ดูแลระบบใช้งาน)

---

### ข้อที่ 2
การเชื่อมต่อระบบบริหารจัดการ IDPS แบบ **Out-of-Band (OOB) / Isolated Management Network** มีข้อดีหลักที่เหนือกว่าแบบ In-Band อย่างไร?
A. ไม่ต้องใช้สายแลนเพิ่มเติม  
B. ซ่อนการมีอยู่และตัวตนของ IDPS จากสายตาผู้โจมตี, ป้องกัน IDPS จากการถูกแฮก, และรับประกันว่ามีแบนด์วิดท์เพียงพอสำหรับบริหารจัดการแม้ในยามที่เครือข่ายหลักกำลังถูก DoS โจมตีอย่างหนัก  
C. ไม่ต้องเสียค่าใช้จ่ายด้านอุปกรณ์เน็ตเวิร์กเพิ่มเติม  
D. ใช้งานได้เฉพาะบนระบบเครือข่าย Wi-Fi  
**เฉลย: B**  
**คำอธิบาย:** OOB ใช้พอร์ตและเครือข่ายทางกายภาพแยกต่างหากจากทราฟฟิกข้อมูลปกติ (Production) ทำให้ผู้โจมตีไม่สามารถสแกนเห็นตัวเซ็นเซอร์ได้ และเมื่อเครือข่ายหลักล่มเพราะ DoS ทราฟฟิกการส่ง Alert ของ IDPS ยังคงทำงานได้ราบรื่น

---

### ข้อที่ 3
ข้อใดคือความแตกต่างทางสถาปัตยกรรมระหว่าง **Inline Sensor** และ **Passive Sensor** ใน Network-Based IDPS?
A. Inline ตรวจสอบเฉพาะสัญญาณไร้สาย ส่วน Passive ตรวจสอบสาย Fiber Optic  
B. Inline จะติดตั้งขวางเส้นทางจราจรของทราฟฟิกโดยตรง (ทราฟฟิกต้องไหลทะลุผ่านตัวมันเหมือนไฟร์วอลล์) ส่วน Passive จะติดตั้งเพื่อเฝ้าดูสำเนา (Copy) ของทราฟฟิก โดยไม่มีทราฟฟิกจริงไหลผ่านตัวมัน  
C. Inline ไม่สามารถสั่งบล็อกแพ็กเก็ตได้ แต่ Passive บล็อกแพ็กเก็ตได้ 100%  
D. Inline ใช้งานได้เฉพาะบนคอมพิวเตอร์ไคลเอนต์เท่านั้น  
**เฉลย: B**  
**คำอธิบาย:** Inline Sensor ถูกวางคั่นกลางระหว่างเส้นทางเน็ตเวิร์ก (In-line) จึงสามารถสั่ง Drop หรือ Sanitizing แพ็กเก็ตได้แบบเรียลไทม์ ส่วน Passive Sensor รับสำเนาแพ็กเก็ตมาตรวจสอบ (ผ่าน SPAN Port หรือ Network Tap) จึงไม่หน่วงเวลาการทำงานของระบบเครือข่าย

---

### ข้อที่ 4
วิธีการใดต่อไปนี้ที่ **ไม่ใช่** วิธีการเชื่อมต่อเพื่อให้ **Passive Sensor** ได้รับสำเนาของทราฟฟิกเครือข่ายมาตรวจสอบตาม NIST SP 800-94?
A. Spanning Port (Port Mirroring บนสวิตช์)  
B. Network Tap (อุปกรณ์ต่อตรงเข้ากับสายสัญญาณทางกายภาพ เช่น สายไฟเบอร์ออปติก)  
C. IDS Load Balancer  
D. NAT Port Forwarding ในเราเตอร์บ้าน  
**เฉลย: D**  
**คำอธิบาย:** สไลด์ระบุ 3 วิธีการเชื่อมต่อหลักของ Passive Sensor คือ:
1. Spanning Port (SPAN)
2. Network Tap (ดักสัญญาณฟิสิคัลโดยตรง)
3. IDS Load Balancer (กระจายสำเนาทราฟฟิกไปยังเซ็นเซอร์หลายตัว)

---

### ข้อที่ 5
การตั้งค่าการทำงานของเซ็นเซอร์ IDPS ในโหมดที่เรียกว่า **Stealth Mode** หมายถึงข้อใด?
A. การปิดพัดลมระบายความร้อนเพื่อไม่ให้มีเสียง  
B. การไม่กำหนดหมายเลข IP Address ให้แก่ Network Interface ใบที่ใช้ดักฟัง/มอนิเตอร์ทราฟฟิก (จะมี IP เฉพาะ Interface ที่ใช้บริหารจัดการเท่านั้น) เพื่อป้องกันไม่ให้ผู้โจมตีเชื่อมต่อไปยังเซ็นเซอร์ได้  
C. การปิดหน้าจอ Console ทุกครั้งที่เลิกงาน  
D. การเข้ารหัสไฟล์ข้อความ Log แบบ AES-256  
**เฉลย: B**  
**คำอธิบาย:** Stealth mode คือการคอนฟิกให้อินเทอร์เฟซมอนิเตอร์ไม่มี IP address ทำให้บนเครือข่ายเสมือนไม่มีโฮสต์นี้อยู่ จึงไม่ตกเป็นเป้าหมายของการสแกนหรือการโจมตีจากแฮกเกอร์

---

### ข้อที่ 6
กลไกการสกัดกั้นภัยคุกคามแบบ **Session Sniping** ที่ใช้ใน **Passive Sensor** มีหลักการทำงานและข้อจำกัดอย่างไร?
A. การส่งคำสั่งปิดระบบปฏิบัติการของเหยื่อ  
B. การส่งแพ็กเก็ต TCP Reset (RST) ปลอมไปยังจุดปลายทางทั้งสองฝั่งเพื่อบังคับให้ตัดการเชื่อมต่อ โดยมีข้อจำกัดคือใช้ได้เฉพาะกับโพรโทคอล TCP เท่านั้น และแพ็กเก็ต RST มักจะไปถึงช้ากว่าแพ็กเก็ตการโจมตี  
C. การยิง ICMP Flood สวนกลับไปยังผู้โจมตี  
D. การตัดสายสัญญาณไฟเบอร์ออปติกโดยอัตโนมัติ  
**เฉลย: B**  
**คำอธิบาย:** Passive Sensor ไม่สามารถ Drop แพ็กเก็ตกลางทางได้ จึงทำได้เพียงส่ง TCP RST ไปหลอกทั้งสองฝั่งว่าอีกฝั่งต้องการยุติการเชื่อมต่อ (Session Sniping) ซึ่งใช้ไม่ได้กับ UDP/ICMP และมักไม่ทันการณ์หากการโจมตีทำสำเร็จไปแล้ว

---

### ข้อที่ 7
ความสามารถในการป้องกัน (Prevention Capabilities) ในข้อใดที่สามารถทำได้เฉพาะบน **Inline IDPS เท่านั้น** และ Passive IDPS ไม่สามารถทำได้?
A. Reconfiguring Other Network Security Devices  
B. Running a Third-Party Program or Script  
C. Performing Inline Firewalling (Drop/Reject) และ Altering/Sanitizing Malicious Content  
D. Sending Alert E-mail to Administrator  
**เฉลย: C**  
**คำอธิบาย:** การทำ Inline Firewalling (สั่ง Drop ทิ้งแพ็กเก็ตทันที), Throttling Bandwidth (บีบแบนด์วิดท์), และ Altering Malicious Content (ล้างเนื้อหาอันตรายออกจากแพ็กเก็ตหรือตัดไฟล์แนบอีเมล) ต้องทำบนเส้นทางที่ทราฟฟิกไหลผ่านตัวเซ็นเซอร์จริง (Inline Only)

---

### ข้อที่ 8
โครงสร้างมาตรฐานของกฎการตรวจจับ (Rule Syntax) ใน Snort ประกอบด้วย 2 ส่วนหลักตามข้อใด?
A. Rule Header และ Rule Options  
B. Rule IP และ Rule Protocol  
C. Rule Input และ Rule Output  
D. Rule Condition และ Rule Action  
**เฉลย: A**  
**คำอธิบาย:** กฎของ Snort แบ่งเป็น 2 ส่วนหลักชัดเจนคือ:
1. **Rule Header:** ระบุ Action, Protocol, Source IP, Source Port, Direction (`->`), Destination IP, Destination Port
2. **Rule Options:** ระบุเงื่อนไขในวงเล็บ `(...)` เช่น `msg`, `content`, `sid`, `rev`

---

### ข้อที่ 9
ใน Rule Header ของ Snort คำสั่ง Action ในข้อใดที่ใช้สร้างข้อความแจ้งเตือน (Alert) พร้อมทั้งบันทึกเหตุการณ์ลงในระบบ Log?
A. `log`  
B. `pass`  
C. `alert`  
D. `drop`  
**เฉลย: C**  
**คำอธิบาย:**
- `alert`: ส่งข้อความเตือนและบันทึกลง log
- `log`: บันทึกแพ็กเก็ตลง log อย่างเดียวไม่ส่งเตือน
- `pass`: ละเว้นการตรวจสอบ (Ignore)
- `drop` / `reject`: ทิ้งแพ็กเก็ต (ใช้ในโหมด Inline/IPS)

---

### ข้อที่ 10
จากโจทย์ Lab 5-A ที่ต้องการเขียนกฎ Snort Rule เพื่อตรวจจับการ **Ping** จากภายนอกเข้ามายัง Web Server เครือข่าย `20.10.1.0/24` ข้อใดคือ Rule Syntax ที่ถูกต้องที่สุด?
A. `alert icmp any any -> 20.10.1.0/24 any (msg:"ICMP Ping Detected"; itype:8; sid:1000001; rev:1;)`  
B. `alert tcp any any -> 20.10.1.0/24 80 (msg:"Ping Detect"; sid:1000001;)`  
C. `drop udp any any -> 20.10.1.0/24 any (msg:"Ping"; sid:1000001;)`  
D. `alert ip 20.10.1.0/24 any -> any any (msg:"Ping"; sid:1000001;)`  
**เฉลย: A**  
**คำอธิบาย:** การ Ping ใช้โพรโทคอล `icmp` โดยคำขอ Echo Request มีค่า ICMP Type เท่ากับ 8 (`itype:8;`) จึงเขียนเป็น `alert icmp any any -> 20.10.1.0/24 any (msg:"ICMP Ping Detected"; itype:8; sid:1000001; rev:1;)`

---

### ข้อที่ 11
ในโจทย์ Lab 5-A ข้อ 3 มีการให้ตรวจจับการรีโมตด้วยบริการ **Telnet** และ **FTP** ไปยัง Web Server กฎของ Snort ต้องระบุพอร์ตปลายทาง (Destination Port) ของทั้งสองบริการนี้อย่างไร?
A. Telnet พอร์ต 22 และ FTP พอร์ต 80  
B. Telnet พอร์ต 23 และ FTP พอร์ต 21  
C. Telnet พอร์ต 25 และ FTP พอร์ต 110  
D. Telnet พอร์ต 53 และ FTP พอร์ต 443  
**เฉลย: B**  
**คำอธิบาย:** หมายเลขพอร์ตมาตรฐานตามข้อกำหนด IANA:
- Telnet: TCP พอร์ต 23
- FTP Control: TCP พอร์ต 21 (Data: TCP พอร์ต 20)

---

### ข้อที่ 12
หากต้องการเขียนกฎ Snort ให้ตรวจจับทั้งพอร์ต **Telnet (23)** และ **FTP (21)** พร้อมกันในกฎข้อเดียว สามารถเขียนระบุช่วงพอร์ตหรือชุดพอร์ตในส่วน Rule Header ได้ตามข้อใด?
A. `alert tcp any any -> 20.10.1.123 [21,23] (msg:"Telnet or FTP Access Detected"; sid:1000002; rev:1;)`  
B. `alert tcp any any -> 20.10.1.123 21-23 (msg:"Detect"; sid:1000002; rev:1;)`  
C. `alert tcp any any -> 20.10.1.123 21&&23 (msg:"Detect"; sid:1000002; rev:1;)`  
D. `alert tcp any any -> 20.10.1.123 (port: 21, 23) (msg:"Detect"; sid:1000002; rev:1;)`  
**เฉลย: A**  
**คำอธิบาย:** ใน Snort Rule Header สามารถกำหนดกลุ่มพอร์ตที่สนใจได้โดยใส่วงเล็บก้ามปูคั่นด้วยจุลภาค เช่น `[21,23]` หรือระบุเป็นพอร์ตเดี่ยวแยกกฎละข้อ

---

### ข้อที่ 13
ในระบบปฏิบัติการ Linux ไฟล์คอนฟิกูเรชันหลัก (Master Configuration File) ของ **Snort** และไฟล์สำหรับกำหนดกฎของผู้ดูแลระบบ (Local Rules) มักจัดเก็บอยู่ที่ไดเรกทอรีและพาธ (File Path) ใดตามลำดับ?
A. `/usr/bin/snort.exe` และ `/home/snort/rules.txt`  
B. `/etc/snort/snort.conf` (สำหรับ Snort 2) หรือ `/etc/snort/snort.lua` (สำหรับ Snort 3) และ `/etc/snort/rules/local.rules`  
C. `/var/log/snort.conf` และ `/tmp/snort.rules`  
D. `/opt/rules/snort.cfg` และ `/etc/default/rules`  
**เฉลย: B**  
**คำอธิบาย:** พาธไฟล์มาตรฐานของ Snort บนลินุกซ์:
- ไฟล์คอนฟิกหลัก: `/etc/snort/snort.conf` (Snort 2) หรือ `/etc/snort/snort.lua` (Snort 3)
- ไฟล์เขียน Custom Rules: `/etc/snort/rules/local.rules`
- ไดเรกทอรีเก็บ Log: `/var/log/snort/`

---

### ข้อที่ 14
ไดเรกทอรีมาตรฐาน (Default Log Directory) ที่ระบบ Snort และ Suricata ใช้ในการบันทึก Log ไฟล์ (เช่น `alert`, `snort.log`, หรือ `eve.json`) คือพาธใด?
A. `/etc/snort/logs/`  
B. `/var/log/snort/` และ `/var/log/suricata/`  
C. `/home/user/logs/`  
D. `/usr/share/snort/`  
**เฉลย: B**  
**คำอธิบาย:** ตามมาตรฐาน FHS ของลินุกซ์ ไฟล์บันทึกประวัติการทำงานและแจ้งเตือนของ IDS จะอยู่ที่ `/var/log/snort/` (เช่น ไฟล์ `alert`) หรือ `/var/log/suricata/` (เช่น ไฟล์ `eve.json`, `fast.log`)

---

### ข้อที่ 15
คำสั่ง CLI ในการสั่งรันโปรแกรม Snort เพื่อทดสอบตรวจสอบกฎในคอนโซลแบบเงียบ (Quiet) โดยระบุอินเทอร์เฟซ `eth1` และไฟล์คอนฟิกหลัก คือข้อใด?
A. `snort -A console -q -c /etc/snort/snort.conf -i eth1`  
B. `snort --run-rules /etc/snort/local.rules eth1`  
C. `snort -start -interface eth1 -file /etc/snort/rules`  
D. `snort -D --interface eth1`  
**เฉลย: A**  
**คำอธิบาย:** 
- `-A console`: ให้แสดง Alert ออกมาทางหน้าจอ Console ทันที
- `-q`: โหมด Quiet ไม่ต้องแสดงแบนเนอร์และข้อมูลสถิติเริ่มต้น
- `-c <path>`: กำหนดไฟล์คอนฟิกูเรชันหลัก
- `-i <interface>`: กำหนด Network Interface ที่ใช้ดักจับข้อมูล

---

### ข้อที่ 16
ใน Rule Options ของ Snort ออปชัน **sid (Snort ID)** ในช่วงหมายเลขใดที่ถูกสงวนไว้สำหรับกฎที่ผู้ดูแลระบบเขียนขึ้นมาใช้งานเองภายในองค์กร (Custom / Local Rules)?
A. หมายเลข 1 ถึง 99  
B. หมายเลข 100 ถึง 999,999  
C. หมายเลขตั้งแต่ 1,000,000 ขึ้นไป (>= 1,000,000)  
D. กำหนดหมายเลขใดก็ได้ไม่จำกัด  
**เฉลย: C**  
**คำอธิบาย:** กฎมาตรฐานของ Snort:
- `sid < 100`: Reserved
- `sid 100 - 999,999`: กฎทางการที่มาจาก Sourcefire / Cisco Talos
- `sid >= 1,000,000`: สงวนไว้สำหรับ Local / Custom Rules ของผู้ใช้ เพื่อไม่ให้หมายเลขทับซ้อนกับชุดกฎทางการ

---

### ข้อที่ 17
ในโจทย์ Lab 5-C สำหรับการตรวจจับ **TCP SYN Flood Attack** โดยใช้ Snort Rule ออปชันใดในวงเล็บที่ใช้วัดความถี่ของแพ็กเก็ต เช่น ตรวจจับหากมี SYN packet ส่งมาเกิน 100 ครั้งภายใน 1 วินาที?
A. `detection_filter: track by_dst, count 100, seconds 1;` หรือ `threshold: type both, track by_src, count 100, seconds 1;`  
B. `limit: 100/sec;`  
C. `timer: 1s, max: 100;`  
D. `flood_watch: packets 100;`  
**เฉลย: A**  
**คำอธิบาย:** ในการตรวจจับ DoS/Flooding Snort มี Rule Option เช่น `detection_filter` หรือ `threshold` (ในเวอร์ชันเดิม) เพื่อกำหนด `count` และ `seconds` ในการตรวจจับทราฟฟิกที่มีปริมาณพุ่งสูงผิดปกติจาก IP เดียวกัน

---

### ข้อที่ 18
หากต้องการตรวจจับคำสั่งในระดับแอปพลิเคชัน เช่น การที่ผู้ใช้ส่งคำสั่ง `USER` หรือ `PASS` ในโพรโทคอล FTP หรือคำสั่ง `GET` ใน HTTP ใน Snort Rule Options ต้องใช้คีย์เวิร์ดใดในการค้นหาข้อความสตริงใน Payload?
A. `find:"...";`  
B. `content:"...";`  
C. `payload_match:"...";`  
D. `string:"...";`  
**เฉลย: B**  
**คำอธิบาย:** `content:"..."` คือคีย์เวิร์ดมาตรฐานของ Snort ที่ใช้ค้นหาแพทเทิร์นของข้อความ (String หรือ Hex) ที่ปรากฏอยู่ในข้อมูล Payload ของแพ็กเก็ต

---

### ข้อที่ 19
ในโจทย์ Lab 5-C ข้อ 7 ถามว่า: "ถ้าต้องการให้ส่งผลไป **Centralized Log Server** ต้องทำอย่างไร?" สถาปัตยกรรมมาตรฐานที่นิยมใช้มากที่สุดในปัจจุบันคือข้อใด?
A. เขียนสคริปต์ก็อปปี้ไฟล์ทุกๆ เที่ยงคืนด้วยคำสั่ง ftp  
B. คอนฟิกให้ Snort/Suricata ส่ง Alert ผ่านทาง Syslog daemon (ส่งต่อไปยัง SIEM Server / ELK Stack) หรือใช้โปรแกรม Log Shipper เช่น Filebeat/Fluentd อ่านจากไฟล์ `/var/log/snort/` หรือ `eve.json` ส่งไปยังเซิร์ฟเวอร์ส่วนกลาง  
C. ส่ง SMS ไปหาผู้ดูแลระบบ  
D. แชร์โฟลเดอร์ผ่าน Windows Samba โดยไม่ต้องตั้งรหัสผ่าน  
**เฉลย: B**  
**คำอธิบาย:** การรวมศูนย์ Log ของ IDPS มักคอนฟิกผ่าน Syslog facility (เช่น `output alert_syslog`) ส่งผ่านพอร์ต UDP 514 ไปยัง SIEM หรือใช้ Agent จำพวก Logstash/Filebeat คอยอ่านไฟล์ JSON ส่งไปยัง Elasticsearch/Splunk

---

### ข้อที่ 20
ข้อดีของการนำ **Iperf** มาใช้สร้างทราฟฟิกปกติ (Normal Traffic) ระหว่างที่ Attacker กำลังทำ Port Scanning หรือ DoS ใน Lab 5-B และ 5-C คืออะไร?
A. เพื่อแกล้งให้ IDS แฮงก์  
B. เพื่อจำลองสถานการณ์จริงที่มีทราฟฟิกปกติและทราฟฟิกโจมตีปะปนกัน (Background Traffic) ช่วยในการทดสอบว่า IDS Rules ที่ตั้งขึ้นสามารถตรวจจับการโจมตีได้ถูกต้อง (True Positive) โดยไม่ส่งสัญญาณเตือนผิดพลาดต่อทราฟฟิกปกติ (False Positive)  
C. เพื่อเพิ่มความเร็วของระบบเครือข่าย  
D. เพื่อสร้างรหัสผ่านอัตโนมัติ  
**เฉลย: B**  
**คำอธิบาย:** ในการทดสอบ IDS ในสภาพแวดล้อมจริง จะต้องมีทราฟฟิกการใช้งานปกติวิ่งอยู่ตลอดเวลา การรัน Iperf ควบคู่ช่วยวัดความแม่นยำในการคัดแยกทราฟฟิกของ Rule และวัดผลว่าทราฟฟิกปกติได้รับผลกระทบหน่วงช้าลงเพียงใด
