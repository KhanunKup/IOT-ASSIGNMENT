# ชุดข้อสอบบทที่ 1: Malicious Software (มัลแวร์และกลไกป้องกัน)
**อ้างอิงเนื้อหา:** Stallings Ch.6 (Computer Security: Principles and Practice, 4th ed.) & NIST SP 800-83

---

### ข้อที่ 1
ตามนิยามของ **NIST SP 800-83** ข้อใดสรุปความหมายของ **Malware** ได้ถูกต้องที่สุด?
A. ซอฟต์แวร์ที่มีข้อผิดพลาดในการเขียนโค้ด (Software Bug) จนส่งผลให้เครื่องคอมพิวเตอร์แฮงก์  
B. โปรแกรมที่ถูกนำเข้าสู่ระบบโดยเจตนาซ่อนเร้น เพื่อทำลาย Confidentiality, Integrity หรือ Availability ของข้อมูล แอปพลิเคชัน หรือระบบปฏิบัติการ  
C. ไฟล์ระบบของ Windows หรือ Linux ที่เสียหายจากการปิดระบบผิดวิธี  
D. สคริปต์ที่ทำงานอัตโนมัติบนเว็บเซิร์ฟเวอร์เพื่อเก็บ Log สถิติผู้ใช้งาน  
**เฉลย: B**  
**คำอธิบาย:** NIST SP 800-83 นิยาม Malware ว่าเป็นโปรแกรมที่ถูกใส่เข้าสู่ระบบโดยแอบแฝง (covertly) เพื่อละเมิดความมั่นคงปลอดภัยด้าน Confidentiality, Integrity, หรือ Availability (CIA Triad) ของเหยื่อ หรือสร้างความปั่นป่วนรบกวน

---

### ข้อที่ 2
การจำแนกประเภทของมัลแวร์ตามโครงสร้างการพึ่งพา มัลแวร์ประเภทใดจัดอยู่ในกลุ่ม **Parasitic (ต้องพึ่งพาโปรแกรมพาหะ)** และไม่สามารถทำงานได้เดี่ยวๆ?
A. Worm  
B. Botnet  
C. Virus  
D. Spam Bot  
**เฉลย: C**  
**คำอธิบาย:** มัลแวร์แบ่งเป็น 2 กลุ่มใหญ่ คือกลุ่มที่ต้องการพาหะ (Parasitic / Need Host Program) เช่น Virus และ Macro Virus และกลุ่มที่เป็นเอกเทศทำงานได้อิสระ (Independent) เช่น Worm, Bot

---

### ข้อที่ 3
วงจรชีวิตของไวรัส (Virus Phases) ประกอบด้วย 4 ขั้นตอน ข้อใดเรียงลำดับขั้นตอนได้อย่างถูกต้อง?
A. Propagation Phase -> Dormant Phase -> Triggering Phase -> Execution Phase  
B. Dormant Phase -> Propagation Phase -> Triggering Phase -> Execution Phase  
C. Triggering Phase -> Dormant Phase -> Propagation Phase -> Execution Phase  
D. Propagation Phase -> Execution Phase -> Dormant Phase -> Triggering Phase  
**เฉลย: B**  
**คำอธิบาย:** วงจรชีวิตของไวรัสเรียงตามลำดับคือ:
1. **Dormant Phase:** ไวรัสสงบนิ่งรอเงื่อนไขกระตุ้น
2. **Propagation Phase:** ไวรัสแพร่กระจายและทำสำเนาตัวเองไปยังโปรแกรมหรือดิสก์อื่น
3. **Triggering Phase:** มีเงื่อนไขเฉพาะมากระตุ้นให้เริ่มทำงาน
4. **Execution Phase:** ทำงานตามฟังก์ชัน Payload (เช่น ลบไฟล์ หรือแสดงข้อความ)

---

### ข้อที่ 4
องค์ประกอบของไวรัสส่วนใดที่ทำหน้าที่ตรวจสอบเงื่อนไขเวลาหรือเหตุการณ์ (Logic Bomb) ก่อนที่ Payload จะทำงาน?
A. Infection Mechanism (Vector)  
B. Replication Engine  
C. Trigger  
D. Encryptor  
**เฉลย: C**  
**คำอธิบาย:** โครงสร้างไวรัสมี 3 ส่วนสำคัญคือ 1. Infection Mechanism (วิธีการแพร่เชื้อ), 2. Trigger (ตัวตรวจสอบเงื่อนไข เช่น วันที่ หรือการกดปุ่ม เรียกว่า Logic Bomb), 3. Payload (การกระทำที่แท้จริง เช่น ทำลายข้อมูลหรือขโมยรหัส)

---

### ข้อที่ 5
ไวรัสประเภทใดที่ทำการติดเชื้อโดยฝังตัวลงใน **Master Boot Record (MBR)** หรือ Partition Boot Record เพื่อให้โค้ดของมันถูกโหลดเข้าสู่หน่วยความจำตั้งแต่ขั้นตอนเปิดเครื่อง ก่อนที่ระบบปฏิบัติการจะบูตเสร็จ?
A. Macro Virus  
B. Boot Sector Infector  
C. Multipartite Virus  
D. File Infector  
**เฉลย: B**  
**คำอธิบาย:** Boot Sector Infector ทำการแพร่เชื้อใน MBR หรือบูตเซกเตอร์ของฟลอปปีดิสก์/ฮาร์ดดิสก์ และจะรันโค้ดก่อน OS บูต

---

### ข้อที่ 6
ไวรัสประเภท **Macro Virus** มีลักษณะการทำงานและแพร่ระบาดอย่างไร?
A. แพร่เชื้อผ่าน BIOS Flash Memory เท่านั้น  
B. แนบตัวไปกับเอกสารที่รองรับสคริปต์คำสั่งอัตโนมัติ เช่น Microsoft Word หรือ Excel  
C. แก้ไขไฟล์ Master File Table (MFT) บนไดรฟ์ NTFS โดยตรง  
D. แปลงโค้ดตัวเองเป็นไฟล์ไบนารีระดับ Assembly x86 เท่านั้น  
**เฉลย: B**  
**คำอธิบาย:** Macro Virus แพร่กระจายผ่าน Macro Script (เช่น VBA) ที่ฝังอยู่ในเอกสารแอปพลิเคชันอย่าง Microsoft Office และเป็นแพลตฟอร์มอิสระ (Platform-independent) ทำงานได้บนทุก OS ที่รันโปรแกรมนั้น

---

### ข้อที่ 7
เทคนิคการหลบเลี่ยงการตรวจจับของไวรัสแบบ **Polymorphic Virus** แตกต่างจาก **Encrypted Virus** แบบดั้งเดิมอย่างไร?
A. Polymorphic Virus ไม่มีการเข้ารหัส Payload  
B. Polymorphic Virus จะสร้างชุดถอดรหัส (Decryption Routine) ที่มีหน้าตาและการคำนวณเปลี่ยนไปทุกครั้งที่แพร่พันธุ์ ทำให้ Signature ของ Routine ไม่ซ้ำเดิม  
C. Encrypted Virus ไม่ใช้ Key ในการถอดรหัส  
D. Polymorphic Virus ทำงานได้เฉพาะบนระบบเครือข่ายไร้สาย  
**เฉลย: B**  
**คำอธิบาย:** Encrypted Virus ทั่วไปจะใช้ Decryption Routine เดิมเปลี่ยนแค่ Key ทำให้ Antivirus ตรวจจับจาก Signature ของตัว Decryption Routine ได้ แต่ Polymorphic Virus มี Mutation Engine ที่สร้าง Decryption Routine รูปแบบใหม่เรื่อยๆ จึงไม่มี Signature คงที่

---

### ข้อที่ 8
การซ่อนตัวแบบ **Metamorphic Virus** คืออะไร?
A. การแปลงส่วนหัวของไฟล์ PE (Portable Executable) เป็น PDF  
B. การเขียนรหัสโปรแกรมทั้งหมดขึ้นมาใหม่ (Rewrite) โดยสมบูรณ์ในทุกการแพร่กระจาย ทั้งโครงสร้างและชุดคำสั่ง แต่ยังคงพฤติกรรมเดิมไว้  
C. การย้ายไฟล์ไปไว้ในไดเรกทอรี Temp แล้วเปลี่ยนนามสกุลไฟล์  
D. การใช้ rootkit ซ่อนโปรเซสใน Task Manager  
**เฉลย: B**  
**คำอธิบาย:** Metamorphic Virus มีความซับซ้อนสูงสุด โดยจะ Disassemble ตัวเองแล้ว Recompile/Reorganize โค้ดใหม่ทั้งหมดทุกครั้ง ทำให้ทั้งโค้ดและพฤติกรรมในระดับคำสั่งเปลี่ยนไปโดยสิ้นเชิง ไม่มีตัวถอดรหัสตายตัว

---

### ข้อที่ 9
ในกลไกการค้นหาเหยื่อ (Target Discovery / Scanning) ของคอมพิวเตอร์เวิร์ม (Worm) วิธีการแบบ **Hit-List Scanning** คือข้อใด?
A. สุ่ม IP address บนอินเทอร์เน็ตไปเรื่อยๆ โดยใช้ Pseudo-random generator  
B. รวบรวมรายชื่อเป้าหมายที่มีช่องโหว่ไว้ล่วงหน้าเป็นก้อนข้อมูล แล้วส่งต่อและแบ่งรายชื่อให้เครื่องที่ติดเชื้อใหม่ช่วยกันสแกน  
C. ตรวจหาข้อมูลเครื่องเป้าหมายจากไฟล์ hosts, address book หรือประวัติเว็บในเครื่องเหยื่อ  
D. สแกนเฉพาะเครือข่าย Local Subnet เดียวกัน (/24)  
**เฉลย: B**  
**คำอธิบาย:** Hit-List scanning คือผู้โจมตีทำลิสต์ IP เป้าหมายที่มีช่องโหว่ไว้ล่วงหน้า เมื่อโจมตีสำเร็จ เครื่องใหม่จะได้รับลิสต์ไปครึ่งหนึ่งเพื่อโจมตีต่อแบบทวีคูณ ทำให้แพร่ระบาดเร็วมากในช่วงเริ่มต้น

---

### ข้อที่ 10
Worm ตัวใดที่สร้างความเสียหายระดับโลกในปี 2017 โดยใช้ช่องโหว่ **EternalBlue (MS17-010)** ในโพรโทคอล SMBv1 เพื่อแพร่กระจายตัวเองอย่างรวดเร็วและเรียกค่าไถ่ไฟล์ข้อมูล?
A. Morris Worm  
B. Melissa  
C. Code Red  
D. WannaCry  
**เฉลย: D**  
**คำอธิบาย:** WannaCry เป็น Ransomware Cryptoworm ที่แพร่กระจายผ่านช่องโหว่ Remote Code Execution ของ SMBv1 (EternalBlue / MS17-010) บนพอร์ต TCP 445

---

### ข้อที่ 11
เทคนิคการโจมตีทางเว็บแบบ **Drive-by-Download** มีลักษณะอย่างไร?
A. ผู้ใช้ต้องกดตกลงและยอมรับการรันไฟล์ Execute (.exe) ด้วยตนเองเสมอ  
B. การที่เหยื่อเพียงแค่เปิดเข้าชมหน้าเว็บเพจที่มีสคริปต์อันตราย โค้ดจะใช้ช่องโหว่ของเบราว์เซอร์หรือปลั๊กอินเพื่อดาวน์โหลดและติดตั้งมัลแวร์โดยที่ผู้ใช้ไม่ได้คลิกยินยอม  
C. ผู้โจมตีส่งอีเมลฟิชชิงแนบลิงก์ Google Drive  
D. การดาวน์โหลดไฟล์ผ่าน BitTorrent ข้ามเครือข่าย  
**เฉลย: B**  
**คำอธิบาย:** Drive-by-download เกิดขึ้นเมื่อผู้ใช้เข้าชมเว็บเพจที่มีโค้ดประสงค์ร้ายฝังอยู่ แล้วโค้ดนั้นใช้ช่องโหว่ของ Browser/Plugin แอบดาวน์โหลดและรันมัลแวร์ในเครื่องเหยื่อทันทีโดยไม่ต้องมีการยืนยันจากผู้ใช้

---

### ข้อที่ 12
การโจมตีแบบ **Watering Hole Attack** มุ่งเน้นการโจมตีกลุ่มเป้าหมายด้วยวิธีการใด?
A. ส่ง SMS หลอกลวงไปยังเบอร์โทรศัพท์ของเหยื่อทุกคนในองค์กร  
B. แฮกและฝังโค้ดมัลแวร์ไว้บนเว็บไซต์ภายนอกที่กลุ่มเป้าหมาย (เช่น บุคลากรในอุตสาหกรรมเฉพาะ) นิยมเข้าใช้งานเป็นประจำ  
C. ปล่อยสัญญาณ Wi-Fi ปลอมในร้านกาแฟ  
D. ส่งมัลแวร์เข้าสู่ระบบประปาของเมือง  
**เฉลย: B**  
**คำอธิบาย:** Watering Hole Attack เลียนแบบสัตว์นักล่าที่ไปดักรอเหยื่อที่แหล่งน้ำ โดยผู้โจมตีจะระบุว่ากลุ่มเป้าหมายชอบเข้าเว็บใดเป็นประจำ แล้วแฮกเว็บนั้นเพื่อปล่อยมัลแวร์ใส่ผู้ที่แวะเข้ามา

---

### ข้อที่ 13
การโจมตีที่หลอกให้ผู้ใช้คลิกสิ่งที่ดูเหมือนไม่มีพิษภัย (เช่น ปุ่มเล่นวิดีโอ) แต่แท้จริงแล้วมีเลเยอร์โปร่งใส (Transparent iframe) ซ้อนทับอยู่ ทำให้การคลิกนั้นกลายเป็นการกด Like, การโอนเงิน หรือการสั่งรันคำสั่งอันตราย เรียกว่าอะไร?
A. Clickjacking (UI Redressing)  
B. SQL Injection  
C. Buffer Overflow  
D. Cross-Site Scripting (XSS)  
**เฉลย: A**  
**คำอธิบาย:** Clickjacking หรือ User Interface (UI) redressing ใช้เฟรมแบบโปร่งใสซ้อนทับองค์ประกอบหน้าเว็บ เพื่อหลอกให้ผู้ใช้กด action ที่ไม่พึงประสงค์โดยไม่รู้ตัว

---

### ข้อที่ 14
ไวรัสคอมพิวเตอร์ในอดีตตัวใดที่มีชื่อเสียงด้าน Payload ในการทำลายฮาร์ดแวร์โดยตรง ด้วยการพยายามเขียนทับ **Flash BIOS** และเขียนทับข้อมูลในฮาร์ดดิสก์?
A. Melissa  
B. Chernobyl (CIH Virus)  
C. Stuxnet  
D. Sasser  
**เฉลย: B**  
**คำอธิบาย:** ไวรัส CIH หรือ Chernobyl ไวรัสจะกระตุ้นการทำงานในวันที่ 26 เมษายน โดย Payload จะเขียนข้อมูลขยะทับ Flash BIOS ของเมนบอร์ดและเขียนทับตารางพาร์ทิชันบนฮาร์ดดิสก์ ทำให้เครื่องเปิดไม่ติด

---

### ข้อที่ 15
โครงสร้างสถาปัตยกรรม Command and Control (C&C หรือ C2) ของ Botnet ในยุคใหม่มักเปลี่ยนจากการใช้โปรโตคอล IRC/HTTP รวมศูนย์ (Centralized) มาเป็นแบบใด เพื่อป้องกันการถูก Take-down จุดเดียว (Single Point of Failure)?
A. Peer-to-Peer (P2P) Architecture  
B. Telnet Architecture  
C. Master-Slave Architecture  
D. Ring Bus Topology  
**เฉลย: A**  
**คำอธิบาย:** Botnet ยุคหลังนิยมใช้สถาปัตยกรรมแบบ Peer-to-Peer (P2P) โดยบ็อตแต่ละตัวสามารถทำหน้าที่เป็นทั้ง Client และ Server กระจายคำสั่งต่อๆ กันไป ทำให้เจ้าหน้าที่ไม่สามารถปิด C2 Server แบบศูนย์กลางได้ง่ายๆ

---

### ข้อที่ 16
Rootkit ระดับใดที่มีสิทธิสูงสุดในการควบคุมระบบ และทำงานอยู่ต่ำกว่าตัวระบบปฏิบัติการหลัก (Operating System) ทำให้แอนตีไวรัสทั่วไปที่รันบน OS ไม่สามารถตรวจพบได้?
A. User-mode Rootkit  
B. Hypervisor / Kernel-mode / Firmware Rootkit  
C. Application-level Rootkit  
D. Shell Script Rootkit  
**เฉลย: B**  
**คำอธิบาย:** Kernel-mode, Hypervisor (Type-1) และ Firmware/BIOS Rootkit ทำงานที่ระดับ Ring 0 หรือลึกกว่านั้น (Ring -1, Ring -2) สามารถดัก Hook system calls และควบคุม OS ได้อย่างสมบูรณ์ จึงซ่อนตัวจากการตรวจสอบของ OS API

---

### ข้อที่ 17
วิวัฒนาการของซอฟต์แวร์ป้องกันไวรัส (Antivirus Software Generations) ข้อใดจับคู่รุ่นและเทคโนโลยีได้อย่างถูกต้องตามตำรา Stallings?
A. 1st Gen: Heuristic rules | 2nd Gen: Simple signatures  
B. 1st Gen: Simple scanners/signatures | 2nd Gen: Heuristic rules & integrity checking  
C. 3rd Gen: Dynamic sandboxing | 4th Gen: Simple scanners  
D. 2nd Gen: Activity traps | 3rd Gen: Simple signatures  
**เฉลย: B**  
**คำอธิบาย:** 
- รุ่นที่ 1 (1st Gen): Simple Scanners ตรวจจับด้วย Signature สตริงคงที่
- รุ่นที่ 2 (2nd Gen): Heuristic Rules (วิเคราะห์ความน่าจะเป็น) และ Integrity Checking (ตรวจผลบวกตรวจสอบ Checksum/Hash)
- รุ่นที่ 3 (3rd Gen): Activity Traps ตรวจจับพฤติกรรมดักจับใน Memory
- รุ่นที่ 4 (4th Gen): Full-Featured Protection ผสมผสาน Behavior Blocking, Sandboxing และ Cloud Intelligence

---

### ข้อที่ 18
เทคนิค **Sandbox Analysis** ในระบบป้องกันมัลแวร์มีหลักการทำงานอย่างไร?
A. การสแกนหาข้อความสตริงที่ตรงกับฐานข้อมูลในฮาร์ดดิสก์  
B. การนำไฟล์ต้องสงสัยไปรันในสภาพแวดล้อมเสมือนที่ถูกแยกส่วน (Isolated Virtual Environment) เพื่อเฝ้าดูพฤติกรรมจริง เช่น การแก้ Registry, การสร้างไฟล์ หรือการเชื่อมต่อเครือข่าย  
C. การบล็อก IP Address ขาเข้าทั้งหมดที่มาจากต่างประเทศ  
D. การปิดการทำงานของพอร์ต USB บนเครื่องคอมพิวเตอร์  
**เฉลย: B**  
**คำอธิบาย:** Sandboxing คือการรันไฟล์ในสภาพแวดล้อมจำลองที่ตัดขาดจากเครือข่ายหลัก เพื่อบันทึกพฤติกรรม (Behavioral profiling) ก่อนตัดสินว่าเป็นมัลแวร์หรือไม่ ป้องกันไม่ให้ส่งผลเสียต่อระบบจริง
