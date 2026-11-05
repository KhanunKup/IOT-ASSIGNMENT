# ชุดข้อสอบบทที่ 3: Cyber Attacks, Threat Modeling & Network Scanning (Theory & Lab 3)
**อ้างอิงเนื้อหา:** Week 7-8 Lecture (Cyber Attacks, Threat Models, Kill Chain) & Lab 03 (Network & Port Scanning)

---

### ข้อที่ 1
ตามมาตรฐาน **RFC 2828** ผลกระทบจากภัยคุกคาม (Threat Consequences) ถูกจัดหมวดหมู่ออกเป็น 4 รูปแบบหลัก ข้อใดระบุได้ถูกต้องครบถ้วน?
A. Confidentiality, Integrity, Availability, Non-Repudiation  
B. Unauthorized Disclosure, Deception, Disruption, Usurpation  
C. Spoofing, Tampering, Repudiation, Denial of Service  
D. Scanning, Exploitation, Infection, Exfiltration  
**เฉลย: B**  
**คำอธิบาย:** RFC 2828 จัดกลุ่มผลลัพธ์ของภัยคุกคามเป็น 4 ด้าน:
1. Unauthorized Disclosure (การเปิดเผยข้อมูลโดยไม่ได้รับอนุญาต)
2. Deception (การหลอกลวง/ข้อมูลเท็จ)
3. Disruption (การขัดขวางการทำงาน)
4. Usurpation (การเข้ายึดครองหรือครอบงำบริการ/สิทธิ์โดยมิชอบ)

---

### ข้อที่ 2
แบบจำลองภัยคุกคาม **STRIDE** ของ Microsoft แต่ละตัวอักษรมีความหมายตรงกับข้อใดตามลำดับ?
A. Scanning, Tracking, Recon, Injection, Decryption, Evasion  
B. Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege  
C. Security, Trust, Reliability, Integrity, Defense, Encryption  
D. Source, Target, Route, Interface, Domain, Endpoint  
**เฉลย: B**  
**คำอธิบาย:** STRIDE คือกรอบ Threat Modeling:
- **S:** Spoofing (การปลอมแปลงตัวตน)
- **T:** Tampering (การแก้ไขดัดแปลงข้อมูล)
- **R:** Repudiation (การปฏิเสธความรับผิดชอบ)
- **I:** Information Disclosure (การรั่วไหลของข้อมูล)
- **D:** Denial of Service (การทำให้ระบบหยุดทำงาน)
- **E:** Elevation of Privilege (การยกระดับสิทธิ์โดยมิชอบ)

---

### ข้อที่ 3
โมเดลประเมินความเสี่ยง **DREAD** ตัวอักษร **E** และ **D** ตัวสุดท้าย ย่อมาจากคำใด?
A. Encryption และ Decryption  
B. Exploitability (ความง่ายในการโจมตีช่องโหว่) และ Discoverability (ความง่ายในการค้นพบช่องโหว่)  
C. Execution และ Destruction  
D. Efficiency และ Durability  
**เฉลย: B**  
**คำอธิบาย:** DREAD ประกอบด้วย:
- **D:** Damage (ความเสียหายที่เกิดขึ้น)
- **R:** Reproducibility (ความสามารถในการทำซ้ำการโจมตี)
- **E:** Exploitability (ความยากง่ายในการเจาะระบบ)
- **A:** Affected Users (ปริมาณผู้ใช้ที่ได้รับผลกระทบ)
- **D:** Discoverability (ความยากง่ายในการตรวจพบช่องโหว่)

---

### ข้อที่ 4
กรอบการทำงาน **Cyber Kill Chain** ที่พัฒนาโดย Lockheed Martin ข้อใดเรียงลำดับขั้นตอนการโจมตีได้ถูกต้องตั้งแต่ต้นจนจบ?
A. Weaponization -> Reconnaissance -> Delivery -> Installation -> Exploitation -> C2 -> Actions on Objectives  
B. Reconnaissance -> Weaponization -> Delivery -> Exploitation -> Installation -> Command & Control (C2) -> Actions on Objectives  
C. Reconnaissance -> Exploitation -> Weaponization -> Delivery -> Installation -> Actions on Objectives -> C2  
D. Delivery -> Reconnaissance -> Exploitation -> Installation -> Weaponization -> C2 -> Actions on Objectives  
**เฉลย: B**  
**คำอธิบาย:** ลำดับทั้ง 7 ขั้นตอนของ Cyber Kill Chain คือ:
1. Reconnaissance (สำรวจหาข้อมูลเป้าหมาย)
2. Weaponization (สร้างอาวุธ/มัลแวร์จับคู่กับช่องโหว่)
3. Delivery (ส่งมัลแวร์ไปยังเป้าหมาย เช่น อีเมล หรือเว็บ)
4. Exploitation (จุดระเบิดช่องโหว่ของซอฟต์แวร์)
5. Installation (ติดตั้งมัลแวร์/แบ็กดอร์ลงในระบบ)
6. Command & Control (เชื่อมต่อช่องทางสั่งการกลับมายังผู้โจมตี)
7. Actions on Objectives (ลงมือทำตามเป้าหมาย เช่น ขโมยหรือทำลายข้อมูล)

---

### ข้อที่ 5
ความแตกต่างระหว่าง **Passive Reconnaissance** และ **Active Reconnaissance** คือข้อใด?
A. Passive ใช้บน Linux ส่วน Active ใช้บน Windows เท่านั้น  
B. Passive ไม่มีการส่งแพ็กเก็ตหรือโต้ตอบกับเครือข่ายเป้าหมายโดยตรง (ไม่เสี่ยงต่อการถูกตรวจจับ) ส่วน Active จะส่งโพรบหรือแพ็กเก็ตไปยังเครื่องเป้าหมายโดยตรง (มีความเสี่ยงถูก IDS/IPS ตรวจพบ)  
C. Passive เจาะระบบได้เร็วกว่า Active เสมอ  
D. Passive ต้องใช้รหัสผ่าน root เท่านั้น  
**เฉลย: B**  
**คำอธิบาย:** Passive Recon ดักฟังข้อมูลหรือค้นหาจาก Open Source Intelligence (OSINT, Shodan, WHOIS) โดยไม่ส่งแพ็กเก็ตไปที่โฮสต์เป้าหมายเลย ส่วน Active Recon เช่น Nmap หรือ Nessus จะส่งคำขอ/แพ็กเก็ตไปโต้ตอบโดยตรง จึงทิ้งร่องรอยไว้ใน Log

---

### ข้อที่ 6
เครื่องมือในข้อใดจัดอยู่ในกลุ่ม **Passive Reconnaissance Tool** ตามเนื้อหาการบรรยาย?
A. Nmap และ OpenVAS  
B. Nikto และ Metasploit  
C. Wireshark, Shodan, VirusTotal, FindSubDomains.com  
D. Nessus และ SQLMap  
**เฉลย: C**  
**คำอธิบาย:** จากสไลด์ Week 7 Top Passive Recon Tools ได้แก่ Wireshark (ดักฟังเงียบๆ), Google Search, FindSubDomains.com, VirusTotal, และ Shodan ส่วน Nmap, Nessus, OpenVAS, Nikto และ Metasploit เป็น Active Recon Tools

---

### ข้อที่ 7
คำสั่ง Nmap ในข้อใดที่ทำการสแกนแบบ **TCP SYN Stealth Scan** (ส่งแพ็กเก็ต SYN และตอบ RST ทันทีเมื่อได้รับ SYN-ACK เพื่อไม่ให้การเชื่อมต่อ 3-way handshake สมบูรณ์)?
A. `nmap -sT <target>`  
B. `nmap -sS <target>`  
C. `nmap -sU <target>`  
D. `nmap -sP <target>`  
**เฉลย: B**  
**คำอธิบาย:** `-sS` คือ SYN Scan หรือ Half-open scan เป็นโหมดสแกนยอดนิยมของ Nmap และเป็นดีฟอลต์เมื่อรันด้วยสิทธิ์ root เพราะรวดเร็วและแอปพลิเคชันส่วนใหญ่จะไม่บันทึก log การเชื่อมต่อที่ไม่สมบูรณ์

---

### ข้อที่ 8
การรันคำสั่ง `nmap -sT <target>` (TCP Connect Scan) มีข้อแตกต่างที่สำคัญจาก `nmap -sS` อย่างไร?
A. `-sT` จำลองเฉพาะโพรโทคอล UDP  
B. `-sT` ทำการเชื่อมต่อ TCP 3-Way Handshake อย่างสมบูรณ์ผ่าน System Call `connect()` ของระบบปฏิบัติการ ทำให้ผู้ใช้ทั่วไปที่ไม่มีสิทธิ์ Root สามารถสั่งรันได้ แต่จะถูกบันทึกใน Log ของเป้าหมายอย่างชัดเจน  
C. `-sT` ไม่ส่งแพ็กเก็ตใดๆ ออกสู่เครือข่าย  
D. `-sT` สแกนได้เร็วกว่า `-sS` ถึง 10 เท่า  
**เฉลย: B**  
**คำอธิบาย:** `-sT` ใช้ฟังก์ชัน `connect()` มาตรฐานของ OS จึงไม่ต้องสร้าง Raw Packet ในระดับเคอร์เนล ทำให้ผู้ใช้ที่ไม่ใช่ root ใช้งานได้ แต่เนื่องจาก Handshake สมบูรณ์ เซิร์ฟเวอร์ปลายทางจึงบันทึก Connection ลง Application Log อย่างง่ายดาย

---

### ข้อที่ 9
หากต้องการให้ Nmap ทำการค้นหาเฉพาะเครื่องที่เปิดใช้งานอยู่ในเครือข่าย (**Host Discovery / Ping Sweep**) โดย**ไม่ต้องทำ Port Scan** ต้องใช้คำสั่งหรือออปชันใด?
A. `nmap -sn <target_subnet>` (หรือ `nmap -sP`)  
B. `nmap -Pn <target_subnet>`  
C. `nmap -p- <target_subnet>`  
D. `nmap -sV <target_subnet>`  
**เฉลย: A**  
**คำอธิบาย:** ออปชัน `-sn` (ใน Nmap เวอร์ชันเก่าใช้ `-sP`) ย่อมาจาก "No port scan" โดยจะทำการ Ping sweep (ส่ง ICMP Echo, TCP SYN ไปยังพอร์ตยอดนิยม ฯลฯ) เพื่อตรวจสอบว่าโฮสต์ใดกำลังออนไลน์อยู่เท่านั้น

---

### ข้อที่ 10
หากเครื่องเป้าหมายมีไฟร์วอลล์บล็อกแพ็กเก็ต ICMP Echo (Ping) ทำให้อุปกรณ์ตรวจสอบคิดว่าเครื่องปิดอยู่ การเพิ่มออปชันใดในคำสั่ง Nmap จะเป็นการสั่งให้ข้ามขั้นตอนการ Ping และบังคับให้สแกนพอร์ตทันทีโดยถือว่าเครื่องเป้าหมายเปิดอยู่เสมอ?
A. `-sn`  
B. `-Pn`  
C. `-sN`  
D. `-n`  
**เฉลย: B**  
**คำอธิบาย:** ออปชัน `-Pn` (Treat all hosts as online -- skip host discovery) สั่งให้ Nmap สแกนพอร์ตเป้าหมายโดยตรงโดยไม่ต้องลอง Ping ก่อน เหมาะมากสำหรับการสแกนเป้าหมายที่มีไฟร์วอลล์บล็อกการ Ping

---

### ข้อที่ 11
การสแกนพอร์ตแบบ **UDP Scan** ใน Nmap ต้องกำหนดด้วยออปชันใด?
A. `nmap -sU <target>`  
B. `nmap -u <target>`  
C. `nmap -sT <target>`  
D. `nmap --udp-fast <target>`  
**เฉลย: A**  
**คำอธิบาย:** `-sU` คือคำสั่งสำหรับทำ UDP Port Scan ซึ่งหลักการคือส่ง UDP packet ไปยังพอร์ตเป้าหมาย หากได้รับข้อความ "ICMP port unreachable" แสดงว่าพอร์ต Closed แต่หากไม่มีการตอบสนองหรือตอบกลับข้อมูล UDP จะถือว่า Open|Filtered

---

### ข้อที่ 12
หากต้องการสั่งให้ Nmap ตรวจสอบเวอร์ชันของ Service และระบุระบบปฏิบัติการ (OS Detection) โดยละเอียด พร้อมทั้งรัน Default Script และทำ Traceroute พร้อมกันในออปชันเดียว ควรใช้คำสั่งใด?
A. `nmap -A <target>`  
B. `nmap -O <target>`  
C. `nmap -sV <target>`  
D. `nmap -v <target>`  
**เฉลย: A**  
**คำอธิบาย:** ออปชัน `-A` (Aggressive scan options) เป็นคำสั่งรวมมิตรที่เปิดการทำงานของ:
1. OS detection (`-O`)
2. Version detection (`-sV`)
3. Script scanning (`-sC`)
4. Traceroute (`--traceroute`)

---

### ข้อที่ 13
จากโจทย์ Lab 3-A กำหนดให้สแกนเครือข่ายที่มี Web Server พอร์ต 8080 และ Some Server พอร์ต 2025 ในซับเน็ต `20.X.1.0/24` หากต้องการกำหนดช่วงพอร์ตให้ Nmap สแกนเฉพาะ 2 พอร์ตนี้เท่านั้น ไวยากรณ์ข้อใดถูกต้อง?
A. `nmap -p 8080,2025 20.X.1.0/24`  
B. `nmap --ports 8080-2025 20.X.1.0/24`  
C. `nmap -P:8080;2025 20.X.1.0/24`  
D. `nmap -port (8080 2025) 20.X.1.0/24`  
**เฉลย: A**  
**คำอธิบาย:** ใน Nmap กำหนดพอร์ตเป้าหมายด้วยพารามิเตอร์ `-p` โดยใช้เครื่องหมายจุลภาค (,) คั่นระหว่างหมายเลขพอร์ต หรือเครื่องหมายยัติภังค์ (-) สำหรับระบุช่วง เช่น `-p 8080,2025` หรือ `-p 1-1024`

---

### ข้อที่ 14
หากต้องการสแกนพอร์ต TCP ทุกพอร์ตที่เป็นไปได้ทั้งหมด (ตั้งแต่ 1 ถึง 65535) ต้องระบุพารามิเตอร์พอร์ตอย่างไร?
A. `-p all`  
B. `-p 1-65535` หรือ `-p-`  
C. `-p *`  
D. `--full-ports`  
**เฉลย: B**  
**คำอธิบาย:** Nmap รองรับชอร์ตคัต `-p-` ซึ่งมีความหมายเทียบเท่ากับการระบุพอร์ตทั้งหมด `-p 1-65535`

---

### ข้อที่ 15
สถานะพอร์ต (Port State) ของผลการสแกน Nmap แบบใด ที่แสดงว่ามี **Firewall, Filter หรือ Packet Filtering** กำลังปิดกั้นการเดินทางของแพ็กเก็ตโพรบ ทำให้ Nmap ไม่สามารถระบุได้ว่าพอร์ตนั้นเปิดหรือปิดอยู่?
A. Open  
B. Closed  
C. Filtered  
D. Unfiltered  
**เฉลย: C**  
**คำอธิบาย:**
- **Open:** แอปพลิเคชันพร้อมรับการเชื่อมต่อ
- **Closed:** ไม่มีแอปพลิเคชันเปิดรับ แต่โฮสต์ตอบกลับ RST
- **Filtered:** แพ็กเก็ตถูกบล็อกหรือดรอปทิ้งโดยอุปกรณ์ป้องกันเครือข่าย (Firewall / Router ACL) ทำให้ไม่มีคำตอบส่งกลับมา
- **Unfiltered:** เข้าถึงพอร์ตได้ (เช่น ตอบ RST ใน ACK scan) แต่ไม่ทราบว่าเปิดหรือปิด

---

### ข้อที่ 16
การสแกนประเภท **Null Scan (`-sN`)**, **FIN Scan (`-sF`)**, และ **Xmas Scan (`-sX`)** อาศัยช่องโหว่ตามมาตรฐาน RFC 793 ของระบบปฏิบัติการที่ใช้ฐาน Unix โดยสำหรับ **Xmas Scan** จะมีการตั้งค่า TCP Flags ใดในแพ็กเก็ตบ้าง?
A. SYN, ACK, RST  
B. FIN, PSH, และ URG (ไฟสว่างระยิบระยับเหมือนต้นคริสต์มาส)  
C. SYN และ FIN เท่านั้น  
D. ECN, CWR, และ ACK  
**เฉลย: B**  
**คำอธิบาย:** Xmas Scan จะเซตธง FIN, PSH, และ URG พร้อมกัน ซึ่งตาม RFC 793 หากพอร์ตปลายทาง Closed โฮสต์จะต้องตอบกลับด้วย RST แต่หากพอร์ต Open โฮสต์จะต้องทิ้งแพ็กเก็ตเงียบๆ ไม่ตอบอะไร

---

### ข้อที่ 17
ออปชันระดับการปรับแต่งความเร็วและเวลาในการส่งโพรบ (Timing Templates) ของ Nmap มีค่าตั้งแต่ `-T0` ถึง `-T5` ออปชันใดที่ปรับให้สแกนเร็วแบบ Aggressive มักใช้ในการทำแล็บหรือเครือข่ายความเร็วสูงที่มีเสถียรภาพ?
A. `-T0` (Paranoid)  
B. `-T2` (Polite)  
C. `-T3` (Normal)  
D. `-T4` (Aggressive)  
**เฉลย: D**  
**คำอธิบาย:**
- `-T0`: Paranoid (ช้ามากเพื่อหลบเลี่ยง IDS)
- `-T1`: Sneaky
- `-T2`: Polite
- `-T3`: Normal (ดีฟอลต์)
- `-T4`: Aggressive (เร็วขึ้น เหมาะกับแล็บหรือเน็ตที่เชื่อถือได้)
- `-T5`: Insane (เร็วที่สุด เสี่ยงต่อการตกหล่นของข้อมูล)

---

### ข้อที่ 18
หากต้องการบันทึกผลการสแกนของ Nmap ออกมาเป็นไฟล์รูปแบบต่างๆ พร้อมกันทั้งหมด (ได้ทั้งรูปแบบ Normal `.nmap`, XML `.xml`, และ Grepable `.gnmap`) ต้องใช้ออปชันใด?
A. `-oN output.txt`  
B. `-oX output.xml`  
C. `-oA <basename>`  
D. `--save-all <filename>`  
**เฉลย: C**  
**คำอธิบาย:** ออปชัน `-oA <basename>` จะสั่งให้ Nmap บันทึกไฟล์ผลลัพธ์ครบทั้ง 3 ตระกูลหลักพร้อมกัน โดยเติมส่วนขยายไฟล์ `.nmap`, `.xml`, และ `.gnmap` อัตโนมัติ

---

### ข้อที่ 19
ในการทำ Lab 3 เพื่อตรวจหาบริการที่ทำงานอยู่และหา Flag ของผู้ใช้งานบนเครื่องเป้าหมาย ข้อใดคือคำสั่ง Nmap ที่ครอบคลุมการระบุชื่อ Service พร้อมเวอร์ชันซอฟต์แวร์ของทุกพอร์ตที่เปิดอยู่บน IP `20.10.1.77` ได้ดีที่สุด?
A. `nmap -sS -p- -sV -T4 20.10.1.77`  
B. `nmap -sn 20.10.1.77`  
C. `nmap -O -p 80 20.10.1.77`  
D. `nmap -sU -p 53 20.10.1.77`  
**เฉลย: A**  
**คำอธิบาย:** คำสั่ง `nmap -sS -p- -sV -T4 20.10.1.77` จะทำการสแกนแบบ SYN stealth ครบทั้ง 65,535 พอร์ต (`-p-`), ตรวจจับเวอร์ชันของบริการที่เปิดอยู่ (`-sV`), และเร่งเวลาการสแกนด้วยความเร็วสูง (`-T4`) ช่วยให้พบพอร์ตแปลกๆ เช่น พอร์ต 2025 ในแล็บได้ทันที

---

### ข้อที่ 20
เครื่องมือ **Nikto** ที่กล่าวถึงในสไลด์ Week 7 ทำหน้าที่หลักในเรื่องใด และเหตุใดจึงไม่เหมาะกับการสแกนแบบลักลอบ (Stealth)?
A. เป็นเครื่องมือถอดรหัส Wi-Fi WPA2 และแอบฟังข้อมูลเงียบๆ  
B. เป็น Web Server Vulnerability Scanner ที่เน้นตรวจหาไฟล์อันตราย/ช่องโหว่ของเว็บเซิร์ฟเวอร์ โดยส่งคำขอนับพันรายการจนเกิด Log มหาศาล ทำให้ IDS/IPS ตรวจพบได้ทันที  
C. เป็นโปรแกรมวิเคราะห์มัลแวร์ในระดับ Binary Assembly  
D. เป็นระบบปฏิบัติการจำลองการโจมตีทางเครือข่าย  
**เฉลย: B**  
**คำอธิบาย:** Nikto เป็นเครื่องมือสแกนหาช่องโหว่ของเว็บเซิร์ฟเวอร์ (เช่น ไฟล์คอนฟิกตกค้าง สคริปต์ CGI ที่มีช่องโหว่) แต่มีความ "เสียงดัง" (Noisy) มาก เพราะกระหน่ำยิงคำขอ HTTP หลายพันรูปแบบ จึงถูกระบบ IDS/IPS ตรวจจับและบล็อกได้อย่างง่ายดาย
