# ชุดข้อสอบทบทวนรวม 50 ข้อ (คละเนื้อหา & ปรับความยาวตัวเลือกให้เท่ากัน)
> **วิชา IT Infrastructure Security (06016421 IT/KMITL)**
> ข้อสอบชุดนี้ผ่านการปรับสมดุลความยาวของตัวเลือก A, B, C, D ให้ใกล้เคียงกันทุกข้อ เพื่อป้องกันการเดาจากความยาวของช้อยส์ พร้อมทั้งกระจายเฉลย A, B, C, D อย่างเท่าเทียม (A: 13, B: 13, C: 12, D: 12 ข้อ)

---

### ข้อที่ 1
**หมวด:** `Malware & Countermeasures`
ตามมาตรฐาน NIST SP 800-83 ข้อใดอธิบายวัตถุประสงค์หลักของการใส่ Malware เข้าสู่ระบบได้ถูกต้อง?

A. เพื่อลดภาระการประมวลผลของซีพียูและเพิ่มพื้นที่ว่างบนฮาร์ดดิสก์ให้สามารถรองรับไฟล์ข้อมูลขนาดใหญ่ได้ดี
B. เพื่อทำการทดสอบประสิทธิภาพของระบบเครือข่ายและวัดอัตราการส่งข้อมูลสูงสุดของอุปกรณ์ฮาร์ดแวร์ในองค์กร
C. เพื่อมุ่งทำลายคุณสมบัติความมั่นคงปลอดภัยด้าน Confidentiality, Integrity หรือ Availability ของระบบเหยื่อ
D. เพื่อทำการสำรองข้อมูลสำคัญของผู้ใช้งานไปยังคลาวด์ภายนอกแบบอัตโนมัติเมื่อระบบเกิดปัญหาขัดข้องกะทันหัน

**เฉลย: C**
**คำอธิบาย:** NIST SP 800-83 ระบุว่ามัลแวร์คือโปรแกรมที่ถูกใส่เข้าสู่ระบบโดยเจตนาแอบแฝงเพื่อทำลาย Confidentiality, Integrity หรือ Availability (CIA Triad) ของข้อมูลหรือระบบเหยื่อ

---

### ข้อที่ 2
**หมวด:** `Malware & Countermeasures`
ความแตกต่างสำคัญระหว่าง Polymorphic Virus และ Metamorphic Virus ในเชิงเทคนิคคือข้อใด?

A. Polymorphic มีขนาดไฟล์คงที่ตลอดเวลา ส่วน Metamorphic มีขนาดไฟล์เปลี่ยนแปลงไปเรื่อยๆ ตามขนาดของหน่วยความจำ
B. Polymorphic เปลี่ยนแปลงเฉพาะ Decryption Routine ส่วน Metamorphic มีการ Rewrite โค้ดทั้งหมดใหม่ทุกการแพร่กระจาย
C. Polymorphic แพร่กระจายผ่านระบบเครือข่ายแลน ส่วน Metamorphic แพร่กระจายผ่านไฟล์เอกสารออฟฟิศและอีเมลภายนอก
D. Polymorphic ทำงานบนระบบปฏิบัติการวินโดวส์ ส่วน Metamorphic ทำงานบนระบบปฏิบัติการลินุกซ์และยูนิกซ์เท่านั้น

**เฉลย: B**
**คำอธิบาย:** Polymorphic Virus ใช้ Mutation Engine สร้าง Decryption Routine ใหม่เรื่อยๆ แต่ตัวไวรัสข้างในยังถอดรหัสออกมาเหมือนเดิม ส่วน Metamorphic Virus จะ Disassemble และ Rewrite โครงสร้างชุดคำสั่งทั้งหมดใหม่ทุกครั้ง

---

### ข้อที่ 3
**หมวด:** `Malware & Countermeasures`
กลไกการค้นหาเหยื่อของเวิร์มแบบ Topological Scanning มีลักษณะการทำงานตรงกับข้อใด?

A. ใช้รายชื่อเป้าหมายที่มีช่องโหว่ซึ่งถูกเตรียมไว้ล่วงหน้า แล้วแบ่งรายชื่อส่งต่อให้โฮสต์ที่ติดเชื้อใหม่ช่วยสแกน
B. ใช้อัลกอริทึมสุ่มหมายเลขไอพีแอดเดรสทั่วโลกแบบ 32 บิตอย่างต่อเนื่อง เพื่อค้นหาพอร์ตที่เปิดรับการเชื่อมต่อ
C. ใช้ข้อมูลเครือข่ายและรายชื่อเครื่องที่มีอยู่แล้วในโฮสต์ของเหยื่อ เช่น ไฟล์ hosts หรือ web bookmarks ในการค้นหา
D. ใช้การบรอดคาสต์แพ็กเก็ตสำรวจเฉพาะภายในเครือข่าย Local Subnet เดียวกันเท่านั้น เพื่อเลี่ยงไฟร์วอลล์ภายนอก

**เฉลย: C**
**คำอธิบาย:** Topological scanning อาศัยข้อมูลที่มีอยู่ในเครื่องเหยื่อ (เช่น ข้อมูลในตาราง routing, hosts file, bookmarks หรือ contact lists) เพื่อหาเป้าหมายถัดไป

---

### ข้อที่ 4
**หมวด:** `Malware & Countermeasures`
ในมัลแวร์เรียกค่าไถ่ (Crypto-Ransomware) นิยมใช้สถาปัตยกรรมการเข้ารหัสรูปแบบใดเพื่อความรวดเร็วและปลอดภัยสูงสุด?

A. ใช้ Asymmetric Encryption เข้ารหัสไฟล์ข้อมูลทุกไฟล์ในเครื่องโดยตรง เพื่อไม่ให้ต้องสร้างคีย์แบบสมมาตรขึ้นมา
B. ใช้ Symmetric Encryption เข้ารหัสไฟล์ในเครื่อง แล้วใช้ Asymmetric Key ของแฮกเกอร์เข้ารหัส Symmetric Key นั้นอีกชั้น
C. ใช้ Hash Function แบบ SHA-256 แปลงไฟล์ข้อมูลทั้งหมดเป็นค่าแฮชที่ไม่สามารถกู้คืนกลับมาเป็นข้อมูลดั้งเดิมได้
D. ใช้ Base64 Encoding ซ่อนเนื้อหาไฟล์ข้อมูลไว้ใน Registry เพื่อรอให้เหยื่อโอนเงินค่าไถ่ผ่านบัญชีธนาคารกลาง

**เฉลย: B**
**คำอธิบาย:** Crypto-Ransomware ใช้ Hybrid Encryption โดยใช้กุญแจสมมาตร (เช่น AES) เข้ารหัสไฟล์ขนาดใหญ่เพราะทำงานเร็วมาก แล้วใช้กุญแจอสมมาตรสาธารณะ (เช่น RSA Public Key) ของแฮกเกอร์เข้ารหัสกุญแจ AES ซ้ำอีกรอบ

---

### ข้อที่ 5
**หมวด:** `Malware & Countermeasures`
Rootkit ชนิดใดที่ทำงานในระดับต่ำกว่าระบบปฏิบัติการ (Sub-OS) และเข้าควบคุมระบบได้เบ็ดเสร็จที่สุด?

A. User-mode Rootkit ที่ทำการ Hooking ผ่านฟังก์ชัน API ของระบบ เพื่อซ่อนโปรเซสในหน้าต่างโปรแกรม Task Manager
B. Kernel-mode หรือ Hypervisor/Firmware Rootkit ที่ฝังตัวในระดับ Ring 0 หรือตัวควบคุมฮาร์ดแวร์เพื่อดักจับ System Calls
C. Application-level Rootkit ที่ทำการแทนที่ไฟล์ไบนารีมาตรฐาน เช่น คำสั่ง ls หรือ ps ด้วยโปรแกรมอันตรายตัวใหม่
D. Script-based Rootkit ที่เขียนด้วยภาษาเชลล์สคริปต์และรันทำงานเป็นเซอร์วิสพื้นหลังในโฟลเดอร์สำหรับเก็บไฟล์ชั่วคราว

**เฉลย: B**
**คำอธิบาย:** Kernel-mode (Ring 0) และ Hypervisor (Ring -1) หรือ Firmware Rootkit ทำงานในระดับสิทธิ์สูงสุด ใต้หรือระดับเดียวกับ OS เคอร์เนล จึงสามารถดักจับการเรียกใช้คำสั่งระบบและซ่อนตัวจากการตรวจสอบของ Antivirus ทั่วไปได้อย่างสมบูรณ์

---

### ข้อที่ 6
**หมวด:** `Malware & Countermeasures`
ตามตำราของ Stallings เทคโนโลยีตรวจจับมัลแวร์รุ่นที่ 3 (Third-Generation Antivirus) โดดเด่นด้วยกลไกใด?

A. การเปรียบเทียบชุดข้อความตัวอักษรคงที่ (Simple Signature Scanner) ในไฟล์ข้อมูลเพื่อระบุชนิดของไวรัสคอมพิวเตอร์
B. การใช้กลไกกับดักพฤติกรรม (Activity Traps) ดักจับในหน่วยความจำเพื่อยับยั้งโปรแกรมต้องสงสัยที่พยายามแก้ไขระบบ
C. การใช้กฎความน่าจะเป็น (Heuristics) ร่วมกับการตรวจสอบความถูกต้องของผลรวมไฟล์ข้อมูลเพื่อตรวจจับสิ่งผิดปกติ
D. การผสานระบบป้องกันเต็มรูปแบบ (Full-Featured Protection) ด้วยการวิเคราะห์พฤติกรรมในแซนด์บ็อกซ์และคลาวด์

**เฉลย: B**
**คำอธิบาย:** รุ่น 1 = Simple signatures, รุ่น 2 = Heuristic rules & integrity checking, รุ่น 3 = Activity traps (ตรวจจับพฤติกรรมน่าสงสัยแบบ real-time ในหน่วยความจำ), รุ่น 4 = Full-featured behavior blocking & sandbox analysis

---

### ข้อที่ 7
**หมวด:** `DoS/DDoS & Lab 4`
คำสั่ง hping3 ข้อใดใช้ยิงทราฟฟิกแบบ ICMP Flood ด้วยความเร็วสูงสุดตรงตามใบงานการทดลอง Lab 4?

A. hping3 x.x.x.x -0 --flood
B. hping3 x.x.x.x -1 --flood
C. hping3 x.x.x.x -2 --flood
D. hping3 x.x.x.x -S --flood

**เฉลย: B**
**คำอธิบาย:** ใน hping3 ออปชัน `-1` ใช้เลือกโหมด ICMP (ค่าเริ่มต้นคือ Echo Request) และ `--flood` คือยิงแพ็กเก็ตออกไปอย่างเร็วที่สุดโดยไม่พิมพ์ผลตอบรับหน้าจอ

---

### ข้อที่ 8
**หมวด:** `DoS/DDoS & Lab 4`
หากต้องการยิงทราฟฟิก TCP SYN Flood ไปยังพอร์ต 80 พร้อมสุ่ม IP แหล่งกำเนิดด้วย hping3 ต้องใช้คำสั่งใด?

A. hping3 -A -p 80 --flood --rand-source x.x.x.x
B. hping3 -1 -p 80 --flood --rand-source x.x.x.x
C. hping3 -2 -p 80 --flood --rand-source x.x.x.x
D. hping3 -S -p 80 --flood --rand-source x.x.x.x

**เฉลย: D**
**คำอธิบาย:** `-S` กำหนดแฟล็ก TCP SYN, `-p 80` ระบุพอร์ตปลายทาง 80, `--flood` โหมส่งเร็วสูงสุด, และ `--rand-source` สุ่ม Source IP address

---

### ข้อที่ 9
**หมวด:** `DoS/DDoS & Lab 4`
ในคำสั่งรัน Server ของ iperf3 ใน Lab 4: `iperf -s -B x.x.x.x` พารามิเตอร์ `-B` มีหน้าที่สำคัญอย่างไร?

A. กำหนดขนาดของบัฟเฟอร์หน่วยความจำในการรับส่งข้อมูล
B. จำกัดปริมาณแบนด์วิดท์สูงสุดที่อนุญาตให้ส่งเข้ามาได้
C. ผูกการทำงานของเซิร์ฟเวอร์เข้ากับหมายเลขไอพีที่กำหนด
D. สั่งให้โปรแกรมทำงานเป็นแบคกราวนด์เซอร์วิสในระบบ

**เฉลย: C**
**คำอธิบาย:** พารามิเตอร์ `-B <ip>` (Bind) ใช้ผูกบริการ iperf เข้ากับอินเทอร์เฟซหรือ IP Address ที่ระบุเจาะจงของเครื่องตนเอง

---

### ข้อที่ 10
**หมวด:** `DoS/DDoS & Lab 4`
จากคำสั่งฝั่ง Observer ใน Lab 4-A: `iperf3 -c x.x.x.x -b 1M -t 30 -u` พารามิเตอร์ `-b 1M` หมายถึงข้อใด?

A. กำหนดอัตราการส่งข้อมูลเป้าหมายเท่ากับ 1 Megabit ต่อวินาที
B. กำหนดขนาดบัฟเฟอร์ในการส่งข้อมูลเท่ากับ 1 Megabyte ต่อรอบ
C. กำหนดจำนวนบล็อกของข้อมูลสูงสุดไม่เกิน 1 ล้านแพ็กเก็ตทดสอบ
D. กำหนดการเชื่อมต่อพร้อมกันสูงสุดของไคลเอนต์ไม่เกิน 1 ครั้ง

**เฉลย: A**
**คำอธิบาย:** `-b 1M` คือการกำหนด Target Bandwidth ที่อัตรา 1 Mbit/sec สำหรับการส่งทราฟฟิกทดสอบ

---

### ข้อที่ 11
**หมวด:** `DoS/DDoS & Lab 4`
ใน Lab 4-A เมื่อทดสอบทราฟฟิก UDP ระหว่างเกิด DoS พารามิเตอร์หลัก 3 ตัวที่ต้องบันทึกที่ฝั่ง Receiver คืออะไร?

A. CPU Usage, Memory Utilization และ Disk Latency
B. Retransmit Count, Round Trip Time และ Window Size
C. Bit Rate, Packet Loss Rate และ Jitter ของทราฟฟิก
D. TCP Flags, Sequence Number และ Acknowledgment Number

**เฉลย: C**
**คำอธิบาย:** ใน Lab 4-A ระบุชัดเจนให้บันทึก Bit Rate, Loss Rate, และ Jitter ที่วัดได้จากฝั่ง Receiver เนื่องจาก UDP เป็น Connectionless protocol

---

### ข้อที่ 12
**หมวด:** `DoS/DDoS & Lab 4`
เหตุใดใบงาน Lab 4 จึงเน้นย้ำว่า: "ก่อนเริ่มใช้ hping3 ให้เอา Default Route ออกให้หมดก่อน"?

A. เพื่อเพิ่มความเร็วในการยิงแพ็กเก็ตของโปรแกรม hping3 ให้เร็วขึ้นเป็นสองเท่า
B. เพื่อป้องกันไม่ให้แพ็กเก็ตที่ยิงโจมตีหลุดรอดออกไปรบกวนโครงข่ายภายนอกของสถาบัน
C. เพื่อหลีกเลี่ยงการถูกระบบไฟร์วอลล์ของเครื่องตนเองทำการบล็อกคำสั่งทดสอบ
D. เพื่อบังคับให้เครื่องคอมพิวเตอร์สลับไปใช้การส่งข้อมูลผ่านการ์ดแลนไร้สายแทน

**เฉลย: B**
**คำอธิบาย:** การลบ Default Route เป็นมาตรการความปลอดภัยเครือข่าย เพื่อป้องกันไม่ให้ทราฟฟิก DoS/Flooding หลุดออกทาง Gateway ไปรบกวนโครงข่ายส่วนกลางของมหาวิทยาลัย

---

### ข้อที่ 13
**หมวด:** `DoS/DDoS & Lab 4`
การโจมตีแบบ SYN Spoofing ส่งผลกระทบต่อโครงสร้างหน่วยความจำส่วนใดของระบบปฏิบัติการเซิร์ฟเวอร์เป้าหมาย?

A. ตาราง Connection Backlog Queue สำหรับรอรับการเชื่อมต่อที่ค้างอยู่
B. ตารางแคชของระบบ Domain Name System บนเครื่องคอมพิวเตอร์แม่ข่าย
C. ตารางแปลงที่อยู่ของ Address Resolution Protocol ในหน่วยความจำหลัก
D. ตารางเส้นทางการส่งต่อแพ็กเก็ตของเคอร์เนลระบบปฏิบัติการเป้าหมาย

**เฉลย: A**
**คำอธิบาย:** SYN Spoofing ทำให้เกิด Half-Open Connections ค้างอยู่ใน Backlog Queue จนพื้นที่เต็ม ทำให้เซิร์ฟเวอร์ไม่สามารถเปิดรับการเชื่อมต่อใหม่จากผู้ใช้ทั่วไปได้

---

### ข้อที่ 14
**หมวด:** `Cyber Attacks & Scanning Lab 3`
คำสั่ง `nmap -sS` แตกต่างจากคำสั่ง `nmap -sT` ในแง่ของกระบวนการส่งแพ็กเก็ตอย่างไร?

A. `nmap -sS` สแกนพอร์ตแบบ UDP ส่วน `nmap -sT` สแกนพอร์ตแบบ TCP โดยส่งแพ็กเก็ตปกติ
B. `nmap -sS` ใช้ตรวจสอบเวอร์ชันบริการ ส่วน `nmap -sT` ใช้ตรวจสอบชนิดระบบปฏิบัติการของโฮสต์
C. `nmap -sS` สแกนช้ากว่าเพื่อหลบไฟร์วอลล์ ส่วน `nmap -sT` สแกนเร็วกว่าโดยไม่สนใจบันทึกล็อก
D. `nmap -sS` ไม่จบ 3-Way Handshake ส่วน `nmap -sT` ทำการเชื่อมต่อ 3-Way Handshake ครบถ้วน

**เฉลย: D**
**คำอธิบาย:** `-sS` (SYN Stealth) เมื่อได้รับ SYN-ACK จะส่ง RST ปิดทันทีโดยไม่ส่ง ACK สุดท้าย ทำให้แอปพลิเคชันส่วนใหญ่ไม่บันทึกล็อก ส่วน `-sT` ใช้ฟังก์ชัน connect() ทำ Handshake สมบูรณ์

---

### ข้อที่ 15
**หมวด:** `Cyber Attacks & Scanning Lab 3`
ในการทำ UDP Port Scan ด้วย Nmap (`nmap -sU`) หากพอร์ตปลายทางปิดอยู่ ระบบจะตอบกลับด้วยสิ่งใด?

A. แพ็กเก็ต TCP RST ยืนยันว่าพอร์ตดังกล่าวไม่ได้เปิดให้บริการในระบบ
B. แพ็กเก็ต ICMP Port Unreachable (Type 3, Code 3) จากโฮสต์เป้าหมาย
C. ไม่มีการตอบกลับใดๆ กลับมายังเครื่องสแกนเนอร์ตลอดช่วงเวลา Timeout
D. แพ็กเก็ต UDP Handshake Response แจ้งสถานะการปฏิเสธการเชื่อมต่อ

**เฉลย: B**
**คำอธิบาย:** ตามมาตรฐานเครือข่าย เมื่อส่ง UDP packet ไปยังพอร์ตที่ไม่มีบริการเปิดรับฟัง โฮสต์ปลายทางจะตอบกลับด้วยข้อความ ICMP Destination Unreachable / Port Unreachable (Type 3 Code 3)

---

### ข้อที่ 16
**หมวด:** `Cyber Attacks & Scanning Lab 3`
หากต้องการตรวจสอบว่าเครื่องใน Subnet ใดเปิดอยู่บ้าง โดยไม่ทำ Port Scan เลย ต้องใช้คำสั่งใด?

A. nmap -sn 20.X.1.0/24
B. nmap -Pn 20.X.1.0/24
C. nmap -sV 20.X.1.0/24
D. nmap -p- 20.X.1.0/24

**เฉลย: A**
**คำอธิบาย:** ออปชัน `-sn` (No port scan หรือเดิมคือ `-sP`) เป็นคำสั่ง Ping Sweep ทำ Host Discovery เพียงอย่างเดียวโดยไม่สแกนพอร์ต

---

### ข้อที่ 17
**หมวด:** `Cyber Attacks & Scanning Lab 3`
ใน Lab 3-A ต้องการสแกนเฉพาะพอร์ต 8080 และ 2025 ของวงเครือข่าย 20.X.1.0/24 ไวยากรณ์ที่ถูกต้องคือข้อใด?

A. nmap -ports (8080 2025) 20.X.1.0/24
B. nmap --ports 8080-2025 20.X.1.0/24
C. nmap -P:8080:2025 20.X.1.0/24
D. nmap -p 8080,2025 20.X.1.0/24

**เฉลย: D**
**คำอธิบาย:** ใน Nmap ระบุหมายเลขพอร์ตด้วย `-p` คั่นด้วยเครื่องหมายจุลภาค (,) เช่น `-p 8080,2025`

---

### ข้อที่ 18
**หมวด:** `Cyber Attacks & Scanning Lab 3`
หากต้องการสแกนพอร์ต TCP ทุกพอร์ตที่เป็นไปได้ทั้งหมด (1 ถึง 65535) ต้องระบุพารามิเตอร์อย่างไร?

A. -p all
B. -p 1-65535 หรือ -p-
C. -p full
D. -p 0-65536

**เฉลย: B**
**คำอธิบาย:** `-p-` เป็นชอร์ตคัตของ Nmap ที่มีความหมายเท่ากับ `-p 1-65535` ซึ่งครอบคลุมทุกพอร์ต TCP ที่มีอยู่ในระบบ

---

### ข้อที่ 19
**หมวด:** `Cyber Attacks & Scanning Lab 3`
ขั้นตอนใดใน Cyber Kill Chain ของ Lockheed Martin ที่แฮกเกอร์ทำการประกอบ Exploit เข้ากับ Payload?

A. Weaponization
B. Reconnaissance
C. Delivery
D. Exploitation

**เฉลย: A**
**คำอธิบาย:** Weaponization คือขั้นตอนที่นำมัลแวร์หรือเพย์โหลดมาบรรจุเข้ากับช่องโหว่ (เช่น ทำไฟล์เอกสาร Word ฝังโทรจัน) ก่อนจะนำไปจัดส่ง (Delivery)

---

### ข้อที่ 20
**หมวด:** `Cyber Attacks & Scanning Lab 3`
ตามโมเดล STRIDE ภัยคุกคามประเภท Tampering และ Repudiation เกี่ยวข้องกับข้อใดตามลำดับ?

A. การแก้ไขเปลี่ยนแปลงข้อมูล และการปฏิเสธความรับผิดชอบ
B. การปลอมแปลงตัวตนผู้ใช้ และการขโมยไฟล์ข้อมูลสำคัญ
C. การทำให้ระบบหยุดทำงาน และการเข้าควบคุมสิทธิ์สูงสุด
D. การดักฟังแพ็กเก็ตในสาย และการติดตั้งไวรัสในระบบ

**เฉลย: A**
**คำอธิบาย:** T = Tampering (การแก้ไขดัดแปลงข้อมูล ทำลาย Integrity) และ R = Repudiation (การปฏิเสธการกระทำ/ความรับผิดชอบ)

---

### ข้อที่ 21
**หมวด:** `IDPS & Lab 5`
โครงสร้างมาตรฐานของ Rule Header ในระบบ Snort ประกอบด้วยลำดับข้อมูลตามข้อใดถูกต้องที่สุด?

A. Action, Protocol, Source IP, Source Port, Direction, Destination IP, Destination Port
B. Protocol, Action, Source IP, Destination IP, Source Port, Destination Port, Direction
C. Action, Source IP, Destination IP, Protocol, Source Port, Destination Port, Direction
D. Direction, Action, Protocol, Source Port, Source IP, Destination Port, Destination IP

**เฉลย: A**
**คำอธิบาย:** รูปแบบ Rule Header ของ Snort: `action proto src_ip src_port -> dst_ip dst_port` เช่น `alert tcp any any -> 192.168.1.1 80`

---

### ข้อที่ 22
**หมวด:** `IDPS & Lab 5`
ใน Rule Options ของ Snort ช่วงหมายเลข sid (Snort ID) ใดที่สงวนไว้สำหรับกฎที่ผู้ใช้สร้างขึ้นเอง (Custom Rules)?

A. sid 1 ถึง 99
B. sid 100 ถึง 999
C. sid 50,000 ถึง 99,999
D. sid 1,000,000 ขึ้นไป

**เฉลย: D**
**คำอธิบาย:** sid ต่ำกว่า 100 สงวนไว้, sid 100 - 999,999 สำหรับกฎมาตรฐานจาก Talos, ส่วน sid ตั้งแต่ 1,000,000 ขึ้นไปจัดไว้สำหรับ Local/Custom Rules ของผู้ใช้งาน

---

### ข้อที่ 23
**หมวด:** `IDPS & Lab 5`
ใน Lab 5-A กฎ Snort Rule สำหรับตรวจจับการ Ping (ICMP Echo Request) ต้องกำหนดออปชันใดในวงเล็บ?

A. itype:8;
B. itype:0;
C. icode:3;
D. icmp_seq:1;

**เฉลย: A**
**คำอธิบาย:** การ Ping คือการส่ง ICMP Echo Request ซึ่งมีค่า ICMP Type เท่ากับ 8 ใน Snort จึงใช้ออปชัน `itype:8;` (ส่วน Type 0 คือ Echo Reply)

---

### ข้อที่ 24
**หมวด:** `IDPS & Lab 5`
บนระบบปฏิบัติการ Linux ไฟล์สำหรับกำหนดกฎของผู้ดูแลระบบ (Local Rules) ของ Snort มักจัดเก็บอยู่ที่พาธใด?

A. /var/log/snort/local.rules
B. /etc/snort/rules/local.rules
C. /usr/bin/snort/local.rules
D. /opt/snort/etc/local.rules

**เฉลย: B**
**คำอธิบาย:** ไดเรกทอรีเก็บกฎมาตรฐานของ Snort คือ `/etc/snort/rules/` และไฟล์สำหรับเขียนกฎเฉพาะของตนเองคือ `/etc/snort/rules/local.rules`

---

### ข้อที่ 25
**หมวด:** `IDPS & Lab 5`
คำสั่ง CLI ในการรัน Snort เพื่อทดสอบแสดงผล Alert ออกทางหน้าจอ Console โดยกำหนดไฟล์คอนฟิกคือคำสั่งใด?

A. snort -T -d /var/log/snort/snort.log -i eth1
B. snort -D --log /etc/snort/rules/local.rules -i eth1
C. snort -A console -q -c /etc/snort/snort.conf -i eth1
D. snort -s --start /etc/snort/snort.lua -dev eth1

**เฉลย: C**
**คำอธิบาย:** `-A console` ให้แสดง Alert บนหน้าจอทันที, `-q` โหมดเงียบ (ไม่พิมพ์แบนเนอร์), `-c <path>` ชี้ไฟล์คอนฟิกหลัก, และ `-i <interface>` กำหนดอินเทอร์เฟซ

---

### ข้อที่ 26
**หมวด:** `IDPS & Lab 5`
ข้อใดเป็นวิธีการเชื่อมต่อที่ใช้เพื่อส่งสำเนาของทราฟฟิกจริงไปให้เซ็นเซอร์แบบ Passive IDS ตรวจสอบ?

A. การติดตั้ง Proxy Gateway คั่นกลางสายสัญญาณเครือข่ายทุกเส้น
B. การใช้งาน Spanning Port (SPAN/Mirroring) บนอุปกรณ์สวิตช์
C. การตั้งค่าให้เซิร์ฟเวอร์ทุกเครื่องเปิดโหมด Port Forwarding
D. การเปิดใช้งาน Dynamic Routing Protocol ข้ามเครือข่ายภายนอก

**เฉลย: B**
**คำอธิบาย:** สไลด์ระบุ 3 วิธีเชื่อมต่อ Passive Sensor คือ Spanning Port (SPAN), Network TAP, และ IDS Load Balancer

---

### ข้อที่ 27
**หมวด:** `IDPS & Lab 5`
ข้อจำกัดสำคัญของเทคนิค Session Sniping ที่ใช้ในการป้องกันภัยคุกคามบน Passive IDS คือข้อใด?

A. จำเป็นต้องใช้สิทธิ์ผู้ดูแลระบบระดับสูงสุดในการรีบูตเครื่องคอมพิวเตอร์เป้าหมาย
B. ใช้ได้เฉพาะกับสายใยแก้วนำแสงเท่านั้น และไม่รองรับสายสัญญาณทองแดงแบบดั้งเดิม
C. ใช้ได้เฉพาะกับโพรโทคอล TCP เท่านั้น และแพ็กเก็ต RST มักไปถึงช้ากว่าทราฟฟิกโจมตี
D. ทำให้ระบบปฏิบัติการของผู้ดูแลระบบเกิดจอฟ้าทันทีเมื่อตรวจพบการส่งข้อมูลผิดปกติ

**เฉลย: C**
**คำอธิบาย:** Session Sniping ส่ง TCP RST ไปหลอกปลายทางทั้งสองข้าง จึงใช้ได้เฉพาะ TCP (ใช้กับ UDP/ICMP ไม่ได้) และ RST มักส่งไปถึงช้าเกินไปหลังการโจมตีสำเร็จแล้ว

---

### ข้อที่ 28
**หมวด:** `Firewall & Lab 6`
ในระบบ iptables ของ Linux ตาราง (Table) ใดเป็นค่าเริ่มต้นสำหรับการคัดกรองแพ็กเก็ต (Packet Filtering)?

A. nat
B. raw
C. mangle
D. filter

**เฉลย: D**
**คำอธิบาย:** ตาราง `filter` เป็น Default Table ของ iptables มี 3 Chains หลักคือ INPUT, OUTPUT, และ FORWARD

---

### ข้อที่ 29
**หมวด:** `Firewall & Lab 6`
ใน iptables Chain ใดทำหน้าที่ตรวจสอบแพ็กเก็ตที่วิ่งผ่านเครื่องลินุกซ์นี้เพื่อไปยังเครือข่ายปลายทางอื่น?

A. FORWARD
B. INPUT
C. OUTPUT
D. PREROUTING

**เฉลย: A**
**คำอธิบาย:** INPUT สำหรับแพ็กเก็ตเข้าหาเครื่อง Local, OUTPUT สำหรับแพ็กเก็ตสร้างจากเครื่อง Local, ส่วน FORWARD สำหรับแพ็กเก็ตที่วิ่งผ่านเครื่องไปที่อื่น (Routed traffic)

---

### ข้อที่ 30
**หมวด:** `Firewall & Lab 6`
คำสั่ง iptables ในข้อใดที่อนุญาตให้ทราฟฟิกตอบกลับของการเชื่อมต่อเดิมที่เคยเปิดไว้วิ่งผ่านได้ (Stateful Rule)?

A. iptables -A FORWARD --return-traffic permit -j ACCEPT
B. iptables -A INPUT -p tcp --stateful-inspection -j ACCEPT
C. iptables -I OUTPUT -m connection-track --status ACTIVE -j ACCEPT
D. iptables -A FORWARD -m state --state ESTABLISHED,RELATED -j ACCEPT

**เฉลย: D**
**คำอธิบาย:** การทำ Stateful Inspection ใน iptables ใช้โมดูล `-m state --state ESTABLISHED,RELATED -j ACCEPT` เพื่อยอมให้ Return Traffic วิ่งผ่านได้อัตโนมัติ

---

### ข้อที่ 31
**หมวด:** `Firewall & Lab 6`
คำสั่ง iptables ใดใช้ตั้งค่านโยบายเริ่มต้น (Default Policy) ของ Chain INPUT ให้ปฏิเสธทราฟฟิกทั้งหมด (Default Deny)?

A. iptables -P INPUT DROP
B. iptables -D INPUT ALL
C. iptables -F INPUT REJECT
D. iptables -A INPUT -j BLOCK

**เฉลย: A**
**คำอธิบาย:** ออปชัน `-P` (Policy) ใช้กำหนดพฤติกรรมเริ่มต้นของ Chain เช่น `iptables -P INPUT DROP` ตามหลัก Implicit/Default Deny

---

### ข้อที่ 32
**หมวด:** `Firewall & Lab 6`
บนระบบปฏิบัติการ Debian/Ubuntu ไฟล์สำหรับเก็บกฎ iptables แบบถาวรหลังรีบูตระบบคือไฟล์ใด?

A. /usr/lib/iptables.conf
B. /var/log/iptables.rules
C. /etc/default/firewall.cfg
D. /etc/iptables/rules.v4

**เฉลย: D**
**คำอธิบาย:** เมื่อใช้ `iptables-persistent` ไฟล์เก็บกฎ IPv4 ถาวรคือ `/etc/iptables/rules.v4` (และ `/etc/iptables/rules.v6` สำหรับ IPv6)

---

### ข้อที่ 33
**หมวด:** `Firewall & Lab 6`
ใน Lab 6-A คำสั่ง FortiGate CLI ใดที่ใช้เปิดให้อินเทอร์เฟซรองรับการจัดการผ่าน Ping, HTTPS, SSH และ HTTP?

A. set allowaccess ping https ssh http
B. permit admin-protocol icmp 443 22 80
C. enable management-interface all-port
D. set admin-service ping web ssh terminal

**เฉลย: A**
**คำอธิบาย:** ใน FortiOS โหมด `config system interface` ใช้คำสั่ง `set allowaccess ping https ssh http` เพื่ออนุญาตโปรโตคอลบริหารจัดการ

---

### ข้อที่ 34
**หมวด:** `Firewall & Lab 6`
ใน Lab 6-B กำหนดให้สร้าง Firewall Policy โดยไม่ใช้ NAT คำสั่ง FortiGate CLI ข้อใดใช้ปิดการทำงานของ NAT?

A. set nat disable
B. no nat enable
C. disable nat-service
D. nat off

**เฉลย: A**
**คำอธิบาย:** ใน `config firewall policy` ของ FortiGate เมื่อไม่ต้องการใช้ NAT ให้ระบุคำสั่ง `set nat disable`

---

### ข้อที่ 35
**หมวด:** `Security Testing NIST SP 800-115`
ตามมาตรฐาน NIST SP 800-115 ขั้นตอนการประเมินความมั่นคงปลอดภัยแบ่งออกเป็น 3 ขั้นตอนหลักตามข้อใด?

A. Reconnaissance, Exploitation และ Reporting
B. Planning, Execution และ Post-Execution
C. Preparation, Penetration และ Recovery
D. Review, Identification และ Mitigation

**เฉลย: B**
**คำอธิบาย:** NIST SP 800-115 กำหนด Methodology เป็น 3 Phases คือ: 1. Planning, 2. Execution, 3. Post-Execution

---

### ข้อที่ 36
**หมวด:** `Security Testing NIST SP 800-115`
ส่วนประกอบหมวด Logistics & Personnel ในเอกสาร Rules of Engagement (ROE) ต้องระบุสิ่งใด?

A. สำเนาใบเสร็จรับเงินค่าจ้างและเอกสารหักภาษี ณ ที่จ่ายของผู้เชี่ยวชาญด้านความปลอดภัย
B. ตารางข้อมูลสเปกฮาร์ดแวร์และยี่ห้อของอุปกรณ์สแกนเนอร์ที่ผู้ทดสอบพกพาเข้ามาในสถานที่
C. รายชื่อและข้อมูลติดต่อ (Points of Contact) ของทีมทดสอบ ผู้บริหาร และทีม Incident Response
D. รหัสผ่านและสิทธิ์การเข้าถึงระดับสูงสุดของระบบฐานข้อมูลหลักเพื่อความสะดวกในการทดสอบ

**เฉลย: C**
**คำอธิบาย:** ROE Template หมวด Logistics & Personnel ต้องระบุรายชื่อและเบอร์ติดต่อ (Points of Contact) ของทั้งทีมผู้ประเมิน ฝ่ายบริหาร และทีมรับมือเหตุฉุกเฉิน (Incident Response Team)

---

### ข้อที่ 37
**หมวด:** `Security Testing NIST SP 800-115`
กิจกรรมในข้อใดต่อไปนี้จัดอยู่ในกลุ่ม Review Techniques ตามมาตรฐาน NIST SP 800-115?

A. Password Cracking, Social Engineering และ Target Vulnerability Penetration Testing
B. Network Discovery, Network Port Identification และ Automated Vulnerability Scanning
C. Documentation Review, Log Review, Ruleset Review และ System Configuration Review
D. Wireless Sniffing, War Driving และ Web Application SQL Injection Exploitation

**เฉลย: C**
**คำอธิบาย:** Review Techniques เป็นการตรวจเชิงเอกสารและการตั้งค่า ได้แก่ ตรวจเอกสาร ตรวจสอบล็อก ตรวจชุดกฎไฟร์วอลล์ และตรวจคอนฟิกของระบบ

---

### ข้อที่ 38
**หมวด:** `Security Testing NIST SP 800-115`
การทดสอบเจาะระบบแบบ Black Box Testing มีลักษณะเด่นที่สำคัญอย่างไร?

A. ผู้ทดสอบทำการทดสอบเฉพาะระบบเครือข่ายไร้สายและระบบสำรองไฟฟ้าของดาต้าเซ็นเตอร์
B. ผู้ทดสอบได้รับซอร์สโค้ดและผังระบบเครือข่ายอย่างละเอียด เพื่อค้นหาจุดบกพร่องเชิงลึก
C. ผู้ทดสอบได้รับบัญชีผู้ใช้งานทั่วไป เพื่อจำลองการกระทำผิดของพนักงานภายในองค์กร
D. ผู้ทดสอบไม่มีข้อมูลหรือความรู้ล่วงหน้าเกี่ยวกับระบบเลย เพื่อจำลองการโจมตีจากภายนอก

**เฉลย: D**
**คำอธิบาย:** Black Box คือการทดสอบที่ผู้ทดสอบไม่มีข้อมูลภายในใดๆ (Zero knowledge) เพื่อจำลองมุมมองของแฮกเกอร์ภายนอกอย่างแท้จริง

---

### ข้อที่ 39
**หมวด:** `Security Testing NIST SP 800-115`
เป้าหมายสำคัญที่สุดของการทำ Root Cause Analysis (RCA) ในขั้นตอน Post-Execution คือข้อใด?

A. เพื่อคำนวณมูลค่าความเสียหายเป็นตัวเงินและส่งข้อมูลให้บริษัทประกันภัยเพื่อเรียกร้องสินไหม
B. เพื่อหาตัวผู้รับผิดชอบที่กระทำความผิดในการตั้งค่าระบบและดำเนินการลงโทษทางวินัย
C. เพื่อระบุต้นตอของปัญหาในระดับกระบวนการหรือนโยบาย มากกว่าการแก้ปัญหาเฉพาะหน้ารายจุด
D. เพื่อนำช่องโหว่ที่ค้นพบไปเผยแพร่ในฐานข้อมูลสาธารณะให้องค์กรอื่นนำไปเป็นกรณีศึกษา

**เฉลย: C**
**คำอธิบาย:** RCA มุ่งหาสาเหตุที่แท้จริงในระดับ Program/Policy (เช่น ขาดการอบรม หรือขาดนโยบาย Patch Management) เพื่อแก้ปัญหาที่รากเหง้าอย่างยั่งยืน

---

### ข้อที่ 40
**หมวด:** `VPN & Lab 7`
ตามมาตรฐาน NIST SP 800-77 โพรโทคอล IPsec ทำงานในระดับเลเยอร์ใดของแบบจำลอง OSI Model?

A. Data Link Layer (Layer 2)
B. Transport Layer (Layer 4)
C. Network Layer (Layer 3)
D. Application Layer (Layer 7)

**เฉลย: C**
**คำอธิบาย:** IPsec เป็นกลไกความปลอดภัยระดับ Network Layer (Layer 3) ทำให้มีความโปร่งใสต่อแอปพลิเคชันทุกชนิดที่ทำงานอยู่ด้านบน

---

### ข้อที่ 41
**หมวด:** `VPN & Lab 7`
ความแตกต่างหลักระหว่างโพรโทคอล AH (Protocol 51) และ ESP (Protocol 50) ใน IPsec คือข้อใด?

A. AH ทำงานเฉพาะบนเครือข่ายไร้สาย ส่วน ESP ทำงานเฉพาะบนสายใยแก้วนำแสงความเร็วสูง
B. AH เข้ารหัสข้อมูลอย่างเดียว ส่วน ESP ทำหน้าที่ยืนยันตัวตนของจุดปลายทางอย่างเดียว
C. AH ตรวจสอบความถูกต้องแต่ไม่เข้ารหัส ส่วน ESP ตรวจสอบความถูกต้องและเข้ารหัสข้อมูล
D. AH ใช้งานใน Transport Mode ได้เท่านั้น ส่วน ESP ใช้งานใน Tunnel Mode ได้เท่านั้น

**เฉลย: C**
**คำอธิบาย:** AH (Protocol 51) ให้เฉพาะ Integrity & Authentication (ไม่เข้ารหัสข้อมูล) ส่วน ESP (Protocol 50) ให้ทั้ง Confidentiality (เข้ารหัส) และ Authentication

---

### ข้อที่ 42
**หมวด:** `VPN & Lab 7`
ใน IPsec การทำงานแบบ Tunnel Mode มีลักษณะการห่อหุ้มแพ็กเก็ตอย่างไร?

A. คงส่วนหัว IP เดิมไว้และเข้ารหัสเฉพาะข้อมูลในเพย์โหลด มักใช้เชื่อมต่อแบบ Host-to-Host
B. เข้ารหัสเฉพาะฟิลด์พอร์ตต้นทางและพอร์ตปลายทางในเลเยอร์การขนส่งเพื่อซ่อนบริการ
C. แปลงแพ็กเก็ตเป็นสัญญาณเลเยอร์ 2 แล้วส่งผ่านทันเนลจำลองโดยไม่ต้องมี IP Header
D. เข้ารหัสแพ็กเก็ต IP เดิมทั้งก้อนแล้วสร้าง IP Header ใหม่ครอบทับ มักใช้แบบ Site-to-Site

**เฉลย: D**
**คำอธิบาย:** Tunnel Mode เข้ารหัส Original IP Packet ทั้งหมด (รวม Header เดิม) แล้วใส่ New Outer IP Header ครอบทับ มักใช้ในเกตเวย์ Site-to-Site

---

### ข้อที่ 43
**หมวด:** `VPN & Lab 7`
ใน Lab 7-B คำสั่ง `tcpdump -n -A -i eth1` พารามิเตอร์ `-n` และ `-A` ทำหน้าที่อย่างไร?

A. จำกัดการจับข้อมูลไม่เกิน 100 ไบต์ และส่งข้อมูลออกทางหน้าต่างแจ้งเตือน
B. นับจำนวนแพ็กเก็ตทั้งหมด และบันทึกข้อมูลแบบไม่ระบุตัวตนของผู้ใช้งาน
C. กรองจับเฉพาะแพ็กเก็ต ARP และปิดการทำงานของอินเทอร์เฟซทันทีที่เสร็จ
D. ไม่แปลงไอพีเป็นชื่อโฮสต์ และแสดงเนื้อหาเพย์โหลดเป็นตัวอักษร ASCII

**เฉลย: D**
**คำอธิบาย:** `-n` ปิดการแปลง IP/Port เป็นชื่อโฮสต์ (ไม่ทำ Reverse DNS เพื่อความเร็ว) และ `-A` แสดงผลลัพธ์เป็นตัวอักษร ASCII

---

### ข้อที่ 44
**หมวด:** `VPN & Lab 7`
หากต้องการบันทึกข้อมูลแพ็กเก็ตดิบจาก tcpdump เป็นไฟล์ .pcap ไปเปิดดูด้วย Wireshark ต้องใช้ออปชันใด?

A. -s Lab07B.pcap
B. -w Lab07B.pcap
C. -o Lab07B.pcap
D. -f Lab07B.pcap

**เฉลย: B**
**คำอธิบาย:** ออปชัน `-w <filename>` สั่งให้ tcpdump เขียนข้อมูลแพ็กเก็ตดิบลงไฟล์ pcap โดยตรงแทนการแสดงผลบนหน้าจอ

---

### ข้อที่ 45
**หมวด:** `VPN & Lab 7`
ในซอฟต์แวร์ OpenVPN ไดรเวอร์เน็ตเวิร์กเสมือนแบบ tun และ tap แตกต่างกันอย่างไร?

A. tun ทำงานที่ Layer 3 (IP Tunnel) ส่วน tap ทำงานที่ Layer 2 (Ethernet Bridging)
B. tun รองรับเฉพาะสายไฟเบอร์ ส่วน tap รองรับเฉพาะการเชื่อมต่อผ่านคลื่นวิทยุไร้สาย
C. tun ต้องติดตั้งบนระบบวินโดวส์ ส่วน tap ต้องติดตั้งบนระบบปฏิบัติการลินุกซ์เท่านั้น
D. tun ใช้สำหรับการควบคุมระยะไกล ส่วน tap ใช้สำหรับการแชร์ไฟล์ข้อมูลในเครือข่าย

**เฉลย: A**
**คำอธิบาย:** `dev tun` ทำงานที่ Layer 3 (IP Routed Tunnel) ส่วน `dev tap` ทำงานที่ Layer 2 (Virtual Ethernet Adapter / Bridged Network)

---

### ข้อที่ 46
**หมวด:** `Cloud Security & IAM`
ข้อใดเป็นหนึ่งใน 5 คุณลักษณะจำเป็น (5 Essential Characteristics) ของคลาวด์ตาม NIST SP 800-145?

A. Hypervisor virtualization
B. Public cloud deployment
C. Software as a Service
D. On-demand self-service

**เฉลย: D**
**คำอธิบาย:** 5 คุณลักษณะของ NIST SP 800-145: 1. On-demand self-service, 2. Broad network access, 3. Resource pooling, 4. Rapid elasticity, 5. Measured service

---

### ข้อที่ 47
**หมวด:** `Cloud Security & IAM`
ตามโมเดล Shared Responsibility ของคลาวด์แบบ IaaS สิ่งใดที่อยู่ในความรับผิดชอบของลูกค้า (Customer)?

A. การจัดการระบบจ่ายไฟสำรองและเครื่องกำเนิดไฟฟ้าดีเซลเพื่อป้องกันไฟดับของระบบ
B. การบำรุงรักษาเครื่องเซิร์ฟเวอร์กายภาพและระบบทำความเย็นภายในอาคารดาต้าเซ็นเตอร์
C. การอัปเดตเฟิร์มแวร์ของสวิตช์และเราเตอร์หลักทางกายภาพของผู้ให้บริการคลาวด์
D. ระบบปฏิบัติการ แอปพลิเคชัน ข้อมูล และการตั้งค่าไฟร์วอลล์ของระบบเครือข่ายเสมือน

**เฉลย: D**
**คำอธิบาย:** ใน IaaS ผู้ให้บริการคลาวด์ดูแล Physical Facilities & Hardware ส่วนลูกค้าต้องดูแล Guest OS, Patches, Apps, Data และ Security Config

---

### ข้อที่ 48
**หมวด:** `Cloud Security & IAM`
ในเอกสาร AWS IAM Policy แบบ JSON คีย์ใดที่ใช้กำหนดว่าอนุญาตหรือปฏิเสธสิทธิ์การกระทำ?

A. Resource
B. Action
C. Effect
D. Principal

**เฉลย: C**
**คำอธิบาย:** คีย์ `Effect` มีค่าเป็น `"Allow"` หรือ `"Deny"` เพื่อระบุว่าจะให้สิทธิ์หรือตัดสิทธิ์ในคำขอนั้น

---

### ข้อที่ 49
**หมวด:** `Cloud Security & IAM`
ในระบบประเมินสิทธิ์ IAM หากมีนโยบายหนึ่งระบุ Allow และอีกนโยบายหนึ่งระบุ Deny ผลลัพธ์จะเป็นอย่างไร?

A. Allow จะมีผลเหนือกว่าเสมอตามหลักความสะดวกในการใช้งาน
B. Explicit Deny จะมีผลเด็ดขาดและปฏิเสธคำขอการเข้าถึงทันที
C. ระบบจะเลือกใช้นโยบายที่ถูกบันทึกล่าสุดลงในฐานข้อมูล
D. ระบบจะแจ้งเตือนข้อผิดพลาดและส่งคำขอไปยังผู้ดูแลระบบ

**เฉลย: B**
**คำอธิบาย:** ตามหลัก IAM Evaluation Logic: Explicit Deny overrides Allow เสมอ หากมีนโยบายสั่ง Deny แม้แต่ข้อเดียว การเข้าถึงจะถูกตัดสิทธิ์ทันที

---

### ข้อที่ 50
**หมวด:** `Cloud Security & IAM`
ความแตกต่างสำคัญระหว่างกระบวนการ Authentication และ Authorization คือข้อใด?

A. Authentication ยืนยันตัวตนผู้ใช้ ส่วน Authorization ตรวจสอบสิทธิ์ในการเข้าถึงทรัพยากร
B. Authentication ตรวจสอบสิทธิ์การใช้งาน ส่วน Authorization ตรวจสอบความถูกต้องของรหัสผ่าน
C. Authentication ทำงานบนเว็บเบราว์เซอร์ ส่วน Authorization ทำงานบนแอปพลิเคชันมือถือ
D. Authentication ใช้งานในเวลากลางวัน ส่วน Authorization ใช้งานในเวลากลางคืนเท่านั้น

**เฉลย: A**
**คำอธิบาย:** Authentication = การพิสูจน์ยืนยันตัวตน (Who you are) ส่วน Authorization = การกำหนดและตรวจสอบสิทธิ์ว่าทำอะไรได้บ้าง (What permissions you have)

---