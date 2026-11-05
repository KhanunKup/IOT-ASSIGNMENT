# ชุดข้อสอบบทที่ 5: Firewall Technologies, Architecture & Configuration (Theory & Lab 6)
**อ้างอิงเนื้อหา:** NIST SP 800-41 Rev 1, Week 12-13 Lecture & Lab 06 (FortiGate Firewall & iptables)

---

### ข้อที่ 1
ตามเอกสาร **NIST SP 800-41 Rev 1** ข้อใดคือบทบาทและคำจำกัดความที่ถูกต้องของ **Firewall** ในระบบเครือข่าย?
A. ซอฟต์แวร์สแกนหาไวรัสในฮาร์ดดิสก์ของเครื่องลูกข่าย  
B. อุปกรณ์หรือโปรแกรมที่ทำหน้าที่ควบคุมการไหลของทราฟฟิกเครือข่ายระหว่างเครือข่ายหรือโฮสต์ที่มีระดับนโยบายความมั่นคงปลอดภัยแตกต่างกัน (Differing security postures)  
C. โปรโตคอลสำหรับเข้ารหัสสายเคเบิลใต้น้ำ  
D. สวิตช์เลเยอร์ 2 ที่ทำหน้าที่กระจายสัญญาณ VLAN  
**เฉลย: B**  
**คำอธิบาย:** ไฟร์วอลล์คืออุปกรณ์หรือซอฟต์แวร์ที่วางคั่นเพื่อควบคุมและคัดกรองทราฟฟิกการสื่อสารระหว่างระบบเครือข่ายที่มีระดับความปลอดภัยไม่เท่ากัน เช่น ระหว่างอินเทอร์เน็ตสาธารณะกับเครือข่ายภายในองค์กร

---

### ข้อที่ 2
เทคโนโลยีไฟร์วอลล์แบบ **Stateful Inspection Firewall** มีจุดเด่นที่เหนือกว่า **Stateless Packet Filtering Firewall** แบบดั้งเดิมอย่างไร?
A. ตรวจจับไวรัสในระดับแรมได้รวดเร็วกว่า  
B. มีการสร้างและบันทึกตารางสถานะการเชื่อมต่อ (State Table) เพื่อติดตามวงจรชีวิตของการเชื่อมต่อ (เช่น TCP Handshake, sequence numbers) และสามารถอนุญาตให้ทราฟฟิกตอบกลับ (Return Traffic) ที่เชื่อมต่ออยู่แล้วผ่านได้อัตโนมัติ  
C. ไม่ต้องใช้ซีพียูในการประมวลผล  
D. ป้องกันการโจมตีแบบ DDoS ขนาดใหญ่ได้ 100% เสมอ  
**เฉลย: B**  
**คำอธิบาย:** Stateful Inspection จะเฝ้าติดตามบริบทของการเชื่อมต่อผ่าน State Table (เช่น สถานะ NEW, ESTABLISHED, RELATED) ทำให้สามารถอนุญาตแพ็กเก็ตที่เป็นฝั่งตอบรับของการเชื่อมต่อไปยังผู้ใช้ภายในได้โดยไม่ต้องเปิดพอร์ตทิ้งไว้แบบ Stateless

---

### ข้อที่ 3
ความสามารถใดเป็นคุณสมบัติเด่นของ **Application Firewall (Proxy Firewall / Deep Packet Inspection)** ที่ไฟร์วอลล์ระดับเครือข่ายทั่วไปไม่สามารถทำได้?
A. การตรวจจับและบล็อกคำสั่งเฉพาะภายในแอปพลิเคชัน เช่น บล็อกคำสั่ง `put` ใน FTP หรือตรวจสอบไฟล์แนบอันตรายในอีเมล  
B. การเข้ารหัสการ์ดแลนในระดับฮาร์ดแวร์  
C. การปรับแรงดันไฟฟ้าของพอร์ตเราเตอร์  
D. การทำงานได้โดยไม่ต้องกำหนดหมายเลข IP  
**เฉลย: A**  
**คำอธิบาย:** Application Firewall สามารถแกะดูเนื้อหาใน Application Layer (Layer 7) จึงสามารถบังคับใช้นโยบายเชิงลึก เช่น ห้ามอัปโหลดไฟล์ผ่านคำสั่ง FTP `put`, ตรวจสอบประเภทไฟล์แนบของอีเมล หรือตรวจจับการใช้โปรโตคอลแชตบนพอร์ต 80

---

### ข้อที่ 4
ข้อจำกัดที่สำคัญที่สุด (Limitations of Firewall Inspection) ของไฟร์วอลล์ยุคปัจจุบันที่ทำให้ไม่สามารถตรวจสอบภัยคุกคามในเพย์โหลดได้โดยตรงคือข้อใด?
A. ทราฟฟิกที่ใช้สายแลน Cat 6  
B. ทราฟฟิกที่เข้ารหัส (Encrypted Traffic เช่น HTTPS/TLS, SSH) และทราฟฟิกที่วิ่งผ่านทันเนล (Tunneled Traffic เช่น VPN)  
C. ทราฟฟิกที่ส่งผ่านโพรโทคอล UDP  
D. ทราฟฟิกที่มาจากระบบปฏิบัติการ Linux  
**เฉลย: B**  
**คำอธิบาย:** ไฟร์วอลล์ไม่สามารถตรวจสอบข้อมูลที่ถูกเข้ารหัสจากต้นทางถึงปลายทาง (End-to-End Encryption) หรือทราฟฟิกที่ห่อหุ้มในทันเนลได้ เว้นแต่จะมีระบบ SSL/TLS Decryption (SSL Inspection) ถอดรหัสตรงจุดไฟร์วอลล์

---

### ข้อที่ 5
พื้นที่เครือข่ายที่เรียกว่า **DMZ (Demilitarized Zone หรือ Screened Subnet)** นิยมนำมาใช้วางระบบเซิร์ฟเวอร์ประเภทใด?
A. เครื่องดาต้าเบสหลักที่เก็บความลับสุดยอดทางการเงินขององค์กร  
B. ระบบเซิร์ฟเวอร์ที่จำเป็นต้องเปิดให้บริการแก่ผู้ใช้งานภายนอกจากอินเทอร์เน็ตสาธารณะ เช่น Public Web Server, Mail Server, หรือ DNS Server  
C. เครื่องคอมพิวเตอร์ส่วนบุคคลของฝ่ายบัญชี  
D. เซิร์ฟเวอร์ Active Directory ภายใน  
**เฉลย: B**  
**คำอธิบาย:** DMZ เป็นโซนกึ่งปลอดภัยที่แยกออกมาจากเครือข่ายภายใน (Inside LAN) โดยเอาไว้ติดตั้งเซิร์ฟเวอร์ที่ต้องเปิดให้โลกภายนอก (Internet/WAN) เข้าถึง เพื่อที่ว่าหากเซิร์ฟเวอร์ใน DMZ ถูกแฮก ผู้โจมตีจะยังไม่สามารถเจาะทะลุเข้าสู่ LAN ภายในได้โดยตรง

---

### ข้อที่ 6
หลักการออกแบบนโยบายความมั่นคงปลอดภัยของไฟร์วอลล์ที่ดีที่สุดตามมาตรฐานสากล (Best Practice Firewall Policy) คือข้อใด?
A. Default Allow (ยอมรับทราฟฟิกทั้งหมด ยกเว้นพอร์ตที่ระบุว่าห้าม)  
B. Default Deny หรือ Implicit Deny (ปฏิเสธและทิ้งทราฟฟิกทั้งหมดเป็นค่าเริ่มต้น และอนุญาตเฉพาะทราฟฟิกที่จำเป็นต่อธุรกิจเท่านั้น)  
C. เปิดทุกพอร์ตในเวลากลางวัน และปิดทุกพอร์ตในเวลากลางคืน  
D. อนุญาตเฉพาะทราฟฟิกที่ไม่มีการเข้ารหัส  
**เฉลย: B**  
**คำอธิบาย:** นโยบายแบบ Default Deny (Implicit Deny All) ถือเป็นกฎข้อสุดท้ายของทุกไฟร์วอลล์ โดยจะไม่อนุญาตให้ทราฟฟิกใดๆ วิ่งผ่านนอกจากจะตรงกับเงื่อนไขในกฎ Whitelist ที่ผู้ดูแลระบบสร้างไว้อย่างชัดเจน

---

### ข้อที่ 7
ในเอกสารประกอบการสอน Lab 6 มีคำเตือนสำคัญระบุว่าเหตุใดจึง**ไม่ควรใช้ FortiGate เวอร์ชัน 7 (FGT ver. 7)** ในการทดลอง แต่แนะนำให้ใช้เวอร์ชัน 6.4.15?
A. เพราะเวอร์ชัน 7 ใช้แรมเกิน 64 GB  
B. เพราะเวอร์ชันประเมิน (Evaluation License) ของ FGT ver. 7 มีข้อจำกัดไม่ยอมให้เลือก TLS/SSL และ Encryption Method ในการทำ VPN ซึ่งจะทำให้เกิดปัญหาในการเชื่อมต่อกับ Client ในแล็บถัดไป  
C. เพราะเวอร์ชัน 7 ไม่รองรับพอร์ต Ethernet  
D. เพราะเวอร์ชัน 7 รันบน GNS3 ไม่ได้  
**เฉลย: B**  
**คำอธิบาย:** ในชีต Lab 6-A ระบุชัดเจนว่า: "(ห้ามใช้ ver. 7 เพราะ FGT Eval. Ver. จะเลือก TLS/SSL และ Encryption Method ในการทำ VPN ไม่ได้ ทำให้มีปัญหาในการ Connect ด้วย Client ที่ตัวเลือกบังคับเช่นกัน)"

---

### ข้อที่ 8
ในโจทย์ Lab 6-A มีการจัดแบ่งโซนเครือข่ายและหมายเลขไอพีซับเน็ตออกเป็น 3 โซน ข้อใดจับคู่ Subnet ได้ถูกต้องตรงตามใบงาน?
A. Management: `10.30.6.0/24` | Outside: `203.0.113.0/24` | Inside: `192.168.1.0/24`  
B. Management: `192.168.1.0/24` | Outside: `10.0.0.0/8` | Inside: `172.16.0.0/16`  
C. Management: `172.20.0.0/24` | Outside: `8.8.8.0/24` | Inside: `192.168.0.0/24`  
D. Management: `10.0.0.0/24` | Outside: `192.168.1.0/24` | Inside: `203.0.113.0/24`  
**เฉลย: A**  
**คำอธิบาย:** ในสไลด์ Lab 6-A และ 6-B ระบุตาราง Zone ชัดเจน:
- Management: `10.30.6.0/24`
- Outside: `203.0.113.0/24`
- Inside: `192.168.1.0/24`

---

### ข้อที่ 9
ในคำสั่ง CLI ของอุปกรณ์ **FortiOS (FortiGate)** ไวยากรณ์ในการคอนฟิกให้พอร์ตอินเทอร์เฟซยอมรับการเข้าถึงเพื่อบริหารจัดการด้วยโปรโตคอล PING, HTTPS, SSH และ HTTP คือข้อใด?
A. `set allowaccess ping https ssh http`  
B. `permit admin-protocols all`  
C. `enable interface-access 22 80 443 icmp`  
D. `access-list permit management-ports`  
**เฉลย: A**  
**คำอธิบาย:** ใน FortiGate CLI คำสั่งกำหนดโปรโตคอลที่ยอมให้เข้ามาบริหารจัดการบน Interface คือคำสั่ง `set allowaccess <protocols...>` เช่น `set allowaccess ping https ssh http` ภายใต้โหมด `config system interface`

---

### ข้อที่ 10
ข้อใดคือโครงสร้างคำสั่ง FortiGate CLI ที่ถูกต้องในการสร้าง **Firewall Policy** เพื่ออนุญาตทราฟฟิกจากพอร์ต Inside ไปยังพอร์ต Outside โดยปิดการทำงานของ NAT ตามเงื่อนไขของ Lab 6-B?
A.
```text
config firewall policy
  edit 1
    set srcintf "port2"
    set dstintf "port3"
    set srcaddr "all"
    set dstaddr "all"
    set action accept
    set schedule "always"
    set service "ALL"
    set nat disable
  next
end
```
B.
```text
firewall add rule from port2 to port3 allow-all no-nat
```
C.
```text
permit ip interface port2 to interface port3 without nat
```
D.
```text
config rule set input=port2 output=port3 nat=off
```  
**เฉลย: A**  
**คำอธิบาย:** ไวยากรณ์มาตรฐานของ FortiOS ในการสร้างนโยบายไฟร์วอลล์จะต้องขึ้นต้นด้วย `config firewall policy` ตามด้วย `edit <id>` และกำหนด `srcintf`, `dstintf`, `srcaddr`, `dstaddr`, `action accept`, และ `set nat disable` ก่อนปิดด้วย `next` และ `end`

---

### ข้อที่ 11
ในโจทย์ Lab 6-B มีคำถามวิเคราะห์ว่า: *"จาก Guideline ที่ว่าเราควรใช้ NAT สำหรับการทำ Routing เท่านั้น โดยไม่ควรใช้มันโดยหวังผลเรื่องของ Security นักศึกษาเห็นด้วยหรือไม่ อย่างไร?"* คำอธิบายตามหลักการ Security สากลที่ถูกต้องคือข้อใด?
A. ไม่เห็นด้วย เพราะ NAT สามารถป้องกันไวรัสได้ทุกชนิด  
B. เห็นด้วย เพราะ NAT (Network Address Translation) เป็นเพียงกลไกแปลงหมายเลข IP เพื่อประหยัดพื้นที่ IPv4 และจัดสรรเส้นทาง โดยไม่ได้ทำหน้าที่ตรวจสอบเนื้อหาเพย์โหลดหรือบันทึก Connection State ที่แท้จริง การรักษาความปลอดภัยต้องอาศัยการตั้งค่า Firewall Access Rules ที่เข้มงวดเท่านั้น  
C. ไม่เห็นด้วย เพราะการทำ NAT ถือเป็นการเข้ารหัสข้อมูลระดับสูงสุด  
D. เห็นด้วย เพราะ NAT ทำให้ความเร็วอินเทอร์เน็ตเพิ่มขึ้นเป็นสองเท่า  
**เฉลย: B**  
**คำอธิบาย:** ผู้เชี่ยวชาญด้านความมั่นคงปลอดภัยเน้นย้ำเสมอว่า "NAT is not a security tool" แม้ NAT จะซ่อน Private IP แต่ไม่สามารถทดแทน Firewall Inspection และ Policy Enforcement ได้เลย

---

### ข้อที่ 12
ในระบบปฏิบัติการ Linux เครื่องมือ **iptables** มีการจัดแบ่งตาราง (Tables) ออกเป็นหมวดหมู่ ตารางใดเป็นตารางปริยาย (Default Table) ที่ใช้สำหรับการกรองแพ็กเก็ต (Packet Filtering) ทั่วไป?
A. `nat`  
B. `mangle`  
C. `filter`  
D. `raw`  
**เฉลย: C**  
**คำอธิบาย:** ตารางใน iptables ประกอบด้วย:
- `filter`: สำหรับการคัดกรองแพ็กเก็ต (เป็นค่าดีฟอลต์หากไม่ระบุตาราง)
- `nat`: สำหรับการแปลงที่อยู่ IP และพอร์ต (SNAT, DNAT)
- `mangle`: สำหรับการแก้ไข Packet Headers พิเศษ (เช่น TOS, TTL)
- `raw`: สำหรับตั้งค่ายกเว้นการติดตามสถานะ (NOTRACK)

---

### ข้อที่ 13
ในตาราง `filter` ของ **iptables** มี Chain หลัก 3 ตัว Chain ใดที่ทำหน้าที่ตรวจสอบแพ็กเก็ตที่มีจุดหมายปลายทางวิ่ง **ทะลุผ่าน (Transit / Routed)** เครื่องลินุกซ์นี้ไปยังเครื่องอื่น?
A. `INPUT`  
B. `OUTPUT`  
C. `FORWARD`  
D. `PREROUTING`  
**เฉลย: C**  
**คำอธิบาย:** 
- `INPUT`: แพ็กเก็ตที่ส่งมายังเครื่อง Local Linux นี้โดยตรง
- `OUTPUT`: แพ็กเก็ตที่ถูกสร้างจากเครื่อง Local Linux นี้ส่งออกไป
- `FORWARD`: แพ็กเก็ตที่วิ่งผ่านเครื่องนี้เพื่อไปยังเครือข่ายปลายทางอื่น (ทำหน้าที่เป็นเราเตอร์/ไฟร์วอลล์)

---

### ข้อที่ 14
คำสั่ง **iptables** ใดที่ใช้กำหนดให้นโยบายปริยาย (Default Policy) ของ Chain `INPUT` เป็นการปฏิเสธทราฟฟิกทั้งหมด (DROP) ตามหลักการ Default Deny?
A. `iptables -P INPUT DROP`  
B. `iptables -D INPUT ALL`  
C. `iptables -A INPUT -j REJECT`  
D. `iptables --set-policy INPUT BLOCK`  
**เฉลย: A**  
**คำอธิบาย:** ออปชัน `-P` (Policy) ใช้สำหรับกำหนดดีฟอลต์แอ็กชันของ Chain นั้นๆ เช่น `iptables -P INPUT DROP` หรือ `iptables -P FORWARD DROP`

---

### ข้อที่ 15
คำสั่ง **iptables** ข้อใดที่เปิดรับเฉพาะการเชื่อมต่อแบบ **SSH (TCP พอร์ต 22)** เข้ามายังเครื่องตนเอง?
A. `iptables -A INPUT -p tcp --dport 22 -j ACCEPT`  
B. `iptables -A OUTPUT -p udp --sport 22 -j ACCEPT`  
C. `iptables -I FORWARD -p icmp --port 22 -j DROP`  
D. `iptables -A INPUT -s 22 -j ALLOW`  
**เฉลย: A**  
**คำอธิบาย:** 
- `-A INPUT`: ต่อท้ายกฎใน Chain INPUT
- `-p tcp`: โพรโทคอล TCP
- `--dport 22`: Destination port หมายเลข 22 (SSH)
- `-j ACCEPT`: Jump target ไปที่ ACCEPT

---

### ข้อที่ 16
ในการคอนฟิก Stateful Firewall ด้วย **iptables** ข้อใดคือคำสั่งที่อนุญาตให้แพ็กเก็ตที่เป็นทราฟฟิกตอบกลับของการเชื่อมต่อเดิมที่เคยอนุญาตไปแล้ว (Established and Related connections) สามารถวิ่งผ่านได้โดยอัตโนมัติ?
A. `iptables -A FORWARD -m state --state ESTABLISHED,RELATED -j ACCEPT`  
B. `iptables -A INPUT --return-traffic accept`  
C. `iptables -A FORWARD -p all --stateful on`  
D. `iptables -I OUTPUT --allow-reply`  
**เฉลย: A**  
**คำอธิบาย:** โมดูล `-m state --state ESTABLISHED,RELATED` เป็นหัวใจสำคัญของ Stateful Firewall ใน iptables เพื่อให้แพ็กเก็ตที่เป็นขากลับของการเชื่อมต่อที่เริ่มอย่างถูกต้องสามารถผ่านได้ทันที

---

### ข้อที่ 17
คำสั่งในการล้าง (Flush) กฎทั้งหมดในทุก Chain ของตารางปัจจุบันใน iptables คือคำสั่งใด?
A. `iptables -F`  
B. `iptables -X`  
C. `iptables -L`  
D. `iptables -Z`  
**เฉลย: A**  
**คำอธิบาย:** 
- `-F` (Flush): ลบล้างกฎทั้งหมดในตาราง
- `-L` (List): แสดงรายชื่อกฎ
- `-Z` (Zero): รีเซ็ตตัวนับแพ็กเก็ตเป็นศูนย์
- `-X` (Delete Chain): ลบ Chain ที่ผู้ใช้สร้างขึ้นเอง

---

### ข้อที่ 18
หากต้องการดูรายชื่อกฎใน **iptables** พร้อมแสดงสถิติจำนวนแพ็กเก็ต (Packets), ไบต์ (Bytes) และแสดงหมายเลขพอร์ต/ไอพีเป็นตัวเลข (Numeric) ไม่ให้แปลงเป็นชื่อโฮสต์ช้าๆ ต้องใช้คำสั่งใด?
A. `iptables -L -n -v`  
B. `iptables --show-rules`  
C. `iptables -S -a`  
D. `iptables -view-all`  
**เฉลย: A**  
**คำอธิบาย:** 
- `-L`: List กฎ
- `-n`: Numeric แสดงผลลัพธ์ IP และ Port เป็นตัวเลขล้วน (ไม่ติด DNS Reverse Lookup)
- `-v`: Verbose แสดงข้อมูลละเอียดรวม Packet และ Byte Counters

---

### ข้อที่ 19
ในระบบปฏิบัติการ Linux ตระกูล Debian/Ubuntu ไฟล์ที่ใช้จัดเก็บกฎ iptables แบบถาวร (Persistent Rules) เพื่อให้โหลดขึ้นมาอัตโนมัติหลังรีบูตระบบคือไฟล์ใด?
A. `/etc/iptables/rules.v4`  
B. `/var/log/iptables.log`  
C. `/etc/network/firewall.conf`  
D. `/usr/bin/iptables.rules`  
**เฉลย: A**  
**คำอธิบาย:** เมื่อติดตั้งแพ็กเกจ `iptables-persistent` กฎ IPv4 จะถูกเซฟไว้ที่ `/etc/iptables/rules.v4` (และ `/etc/iptables/rules.v6` สำหรับ IPv6) ผ่านคำสั่ง `iptables-save > /etc/iptables/rules.v4`

---

### ข้อที่ 20
ความแตกต่างที่สำคัญในเชิงสถาปัตยกรรมระหว่างการทำ **Access Control บน Firewall** เปรียบเทียบกับการใช้ **Access Control Lists (ACLs) บนเราเตอร์แบบดั้งเดิม** คือข้อใด?
A. เราเตอร์สามารถตรวจจับไวรัสในแอปพลิเคชันได้ดีกว่าไฟร์วอลล์  
B. ACL บนเราเตอร์ดั้งเดิมทำงานแบบ Stateless (ตรวจทีละแพ็กเก็ตแยกเดี่ยว ไม่จดจำการเชื่อมต่อ) ทำให้ต้องเปิดพอร์ตขากลับไว้ตลอดเวลา ในขณะที่ Firewall ทำงานแบบ Stateful/Deep Inspection มี State Table และรองรับการจัดการ Policy และ Zone ที่ยืดหยุ่นกว่ามาก  
C. ACL บนเราเตอร์ทำงานช้ากว่าไฟร์วอลล์ 100 เท่า  
D. ไฟร์วอลล์ไม่สามารถจัดการ IP Address ได้  
**เฉลย: B**  
**คำอธิบาย:** เราเตอร์ ACL แบบดั้งเดิมเป็น Stateless คัดกรองจากฟิลด์ใน Header ต่อแพ็กเก็ต ทำให้ต้องเขียน Permit พอร์ตสูงๆ ฝั่งขากลับทิ้งไว้ เกิดช่องโหว่ความปลอดภัย ขณะที่ Firewall เป็น Stateful ติดตามสถานะ Session แบบไดนามิก
