/* Prakriti / Spatial Intelligence
   All content comes from src/_data/projects.js via window.PROJECTS.
   Canvas work here is schematic and says so on screen. */

const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Real geography. world.json always exists; bengaluru.json appears once you run
   tools/build-geo.mjs over your shapefiles. Everything degrades to the schematic
   if a file is missing, so the site never breaks waiting on data. */
const GEO = { world: null, world50: null, blr: null };

/* Coastlines are inlined rather than fetched. Natural Earth 110m, simplified,
   encoded as "lon:lat" tenths of a degree, rings separated by semicolons.
   A fetch here meant the globe was empty whenever the deploy dropped the file,
   which is a silly way to lose the main image on the page. */
const WORLD_110 = '-1800:690,-1749:672,-1750:666,-1743:663,-1746:671,-1719:669,-1699:660,-1725:654,-1730:642,-1762:654,-1784:654,-1787:661,-1799:659,-1794:654,-1800:650,1800:650,1774:646,1794:630,1792:623,1774:625,1737:616,1703:599,1689:606,1663:598,1658:602,1635:599,1620:582,1632:576,1631:562,1621:561,1617:553,1621:548,1604:544,1600:532,1585:530,1582:519,1568:510,1554:554,1559:568,1568:578,1584:581,1637:611,1645:626,1633:625,1627:616,1601:606,1593:618,1567:614,1542:598,1550:592,1513:588,1513:595,1498:597,1486:592,1422:590,1351:547,1367:546,1382:538,1399:542,1414:531,1414:522,1406:512,1401:484,1382:463,1349:434,1335:428,1323:433,1300:419,1297:409,1275:398,1274:392,1295:368,1291:351,1265:344,1261:367,1269:369,1262:378,1247:381,1253:396,1243:399,1210:389,1222:404,1216:410,1190:392,1180:392,1175:387,1189:374,1197:372,1208:379,1224:375,1225:369,1211:366,1192:349,1202:344,1219:317,1219:310,1213:307,1221:298,1217:282,1211:281,1187:246,1159:228,1108:214,1104:203,1099:203,1099:214,1085:217,1059:198,1057:191,1089:153,1093:134,1092:117,1052:86,1051:99,1035:106,1026:122,1008:126,1010:134,1001:134,992:92,999:92,1005:74,1030:55,1042:13,1035:12,1014:28,1001:65,985:84,983:78,988:114,972:169,954:157,942:160,943:182,914:228,905:228,903:218,870:215,865:202,851:195,822:166,803:159,799:104,775:80,766:89,735:160,726:214,705:209,692:221,696:224,694:228,674:240,664:254,615:251,574:257,565:271,547:265,515:279,501:302,480:300,488:277,502:267,508:248,510:260,516:258,518:240,540:241,564:264,568:242,587:236,598:223,578:202,577:190,553:172,524:164,522:156,487:140,435:126,426:152,426:168,391:213,385:237,375:243,351:281,346:281,349:295,339:276,324:298,357:239,355:231,369:220,375:186,384:180,393:159,433:124,427:117,446:104,511:120,510:106,477:42,403:-26,392:-47,387:-59,394:-68,392:-85,405:-108,408:-147,401:-161,348:-198,356:-221,355:-241,326:-257,329:-262,325:-283,300:-311,282:-328,258:-340,226:-339,196:-348,182:-339,182:-317,152:-271,143:-221,118:-181,122:-144,136:-120,137:-107,129:-92,132:-86,119:-50,88:-11,98:31,85:48,71:45,59:43,43:63,27:63,-20:47,-46:52,-80:44,-124:73,-148:109,-166:122,-167:136,-176:147,-165:161,-162:181,-170:219,-144:262,-96:299,-98:312,-93:326,-69:341,-59:358,-22:352,15:366,95:374,102:372,102:367,111:369,106:364,109:357,103:338,152:323,157:314,191:303,200:310,201:322,215:328,289:309,310:316,320:309,338:310,346:316,360:346,362:366,347:368,325:361,317:366,297:361,276:367,263:382,268:390,262:395,273:404,288:405,292:412,312:411,335:420,352:420,384:410,404:410,417:420,414:426,367:452,382:462,377:466,391:473,350:463,350:456,365:455,363:451,339:444,333:446,336:450,324:453,336:458,333:461,308:466,296:450,288:449,277:426,288:411,276:410,264:402,261:408,249:410,237:407,244:401,239:400,226:403,240:376,231:379,234:374,228:373,232:364,225:364,217:368,211:383,194:402,195:417,160:435,149:451,140:448,139:456,131:457,123:454,126:441,151:420,159:420,159:415,185:402,183:398,169:404,164:398,172:394,170:389,161:380,157:379,161:390,154:400,121:417,105:429,102:439,89:444,65:431,31:431,30:419,8:410,-3:393,1:387,-22:367,-44:367,-54:360,-65:369,-89:369,-88:383,-95:387,-88:408,-94:430,-80:438,-19:434,-14:440,-12:460,-30:476,-45:480,-46:487,-16:486,-19:498,-10:494,13:501,16:510,38:516,47:531,81:535,88:540,81:555,85:571,106:577,102:569,109:565,96:555,99:546,109:540,125:545,141:538,176:548,197:544,213:552,211:568,216:574,225:578,233:570,241:570,244:584,234:586,233:592,280:595,291:600,281:605,229:598,213:607,215:617,211:626,215:632,254:651,239:660,222:657,212:650,214:644,178:628,171:613,188:601,179:590,168:587,159:561,147:562,141:554,129:554,104:595,84:583,70:581,57:586,50:620,105:645,148:678,192:698,230:702,246:710,282:712,313:704,300:702,311:696,321:699,403:679,411:668,400:663,384:660,332:666,348:659,349:644,370:638,365:648,372:651,396:645,404:648,398:655,421:665,440:661,445:668,437:674,442:680,434:686,462:682,468:677,456:676,456:670,464:667,537:689,545:688,535:682,588:689,599:683,611:689,600:695,606:698,685:681,692:686,669:694,673:699,667:710,699:730,726:728,728:722,718:714,728:704,726:690,737:684,713:663,724:662,750:678,745:683,749:690,738:691,736:696,744:706,731:714,749:721,747:728,757:723,753:713,764:712,759:719,776:723,815:718,806:726,805:736,868:739,860:745,872:751,1008:764,1020:773,1044:777,1061:774,1047:771,1070:770,1072:765,1111:767,1141:758,1139:753,1094:742,1130:740,1135:733,1156:738,1232:730,1233:737,1270:736,1286:730,1290:724,1285:720,1313:708,1322:718,1339:714,1399:715,1392:724,1405:728,1495:722,1530:708,1590:709,1598:704,1597:697,1609:694,1678:696,1696:687,1708:690,1700:696,1704:701,1786:694,-1800:690;-906:695,-906:685,-892:693,-880:686,-883:679,-874:672,-856:688,-855:699,-826:697,-813:692,-820:681,-813:676,-814:671,-834:664,-858:666,-873:648,-899:640,-907:636,-908:630,-932:620,-942:609,-947:590,-932:588,-923:571,-909:573,-850:553,-823:552,-821:533,-799:512,-786:526,-798:547,-782:551,-765:565,-773:580,-785:588,-773:598,-781:623,-738:624,-714:611,-696:611,-693:590,-676:582,-662:588,-646:603,-614:570,-618:563,-573:546,-569:538,-558:533,-557:522,-600:502,-664:502,-711:468,-686:483,-650:492,-642:487,-651:481,-645:462,-615:459,-605:470,-598:459,-654:436,-661:436,-662:445,-644:453,-671:451,-670:448,-707:430,-708:423,-700:416,-737:409,-719:409,-740:408,-749:389,-755:395,-751:384,-759:372,-757:379,-764:392,-763:381,-770:382,-763:379,-757:356,-813:314,-813:300,-801:269,-804:252,-812:252,-817:259,-829:279,-829:291,-841:301,-851:296,-864:304,-892:303,-896:302,-892:293,-902:291,-938:297,-966:283,-974:274,-971:259,-979:224,-963:193,-944:181,-920:187,-908:193,-903:210,-870:215,-868:208,-878:183,-883:185,-884:165,-889:159,-850:160,-834:153,-838:111,-822:90,-814:88,-796:96,-768:86,-757:94,-749:111,-734:112,-718:124,-711:121,-720:114,-717:91,-710:99,-714:110,-702:114,-699:122,-682:106,-662:106,-649:101,-643:106,-619:107,-627:104,-624:100,-608:94,-607:86,-591:80,-572:60,-540:58,-513:42,-505:19,-500:17,-507:2,-504:-1,-486:-2,-486:-12,-478:-6,-449:-16,-446:-27,-434:-24,-400:-29,-372:-48,-356:-52,-347:-73,-351:-90,-387:-131,-393:-179,-410:-219,-420:-230,-446:-234,-476:-249,-485:-259,-489:-287,-538:-344,-562:-349,-584:-339,-585:-344,-572:-353,-568:-369,-578:-382,-592:-387,-623:-388,-622:-407,-628:-410,-651:-411,-650:-421,-638:-420,-635:-426,-652:-435,-656:-450,-673:-456,-676:-463,-656:-472,-660:-481,-691:-507,-682:-524,-708:-529,-714:-539,-750:-523,-753:-516,-750:-510,-756:-487,-741:-469,-756:-466,-747:-458,-744:-441,-732:-444,-727:-424,-734:-421,-737:-434,-743:-432,-732:-393,-736:-372,-732:-371,-714:-324,-715:-289,-709:-276,-702:-198,-704:-184,-715:-174,-760:-146,-798:-72,-812:-61,-809:-57,-814:-47,-798:-27,-810:-22,-809:-11,-801:8,-789:14,-784:26,-771:38,-782:83,-796:89,-805:81,-800:76,-809:72,-811:78,-835:84,-850:101,-851:96,-857:99,-857:111,-877:129,-875:133,-912:139,-947:162,-966:156,-1035:183,-1055:200,-1053:214,-1060:228,-1093:256,-1093:264,-1122:290,-1132:312,-1139:316,-1148:318,-1147:302,-1116:267,-1107:243,-1094:234,-1100:228,-1122:247,-1123:260,-1151:277,-1142:286,-1155:296,-1173:330,-1185:340,-1206:346,-1244:403,-1245:428,-1239:455,-1247:482,-1231:480,-1226:471,-1228:490,-1274:508,-1278:523,-1291:528,-1293:536,-1320:555,-1341:581,-1366:582,-1399:595,-1471:609,-1482:607,-1480:600,-1517:592,-1514:607,-1504:610,-1506:613,-1540:594,-1533:589,-1542:582,-1584:560,-1648:544,-1577:576,-1570:589,-1591:584,-1604:591,-1620:587,-1619:596,-1638:598,-1661:615,-1646:632,-1608:638,-1615:644,-1608:648,-1650:644,-1681:657,-1645:666,-1636:666,-1638:661,-1617:661,-1668:684,-1662:689,-1632:694,-1619:703,-1566:714,-1543:707,-1436:702,-1365:689,-1298:702,-1291:698,-1281:705,-1258:695,-1244:702,-1243:694,-1215:698,-1152:689,-1139:684,-1153:679,-1100:680,-1089:674,-1078:679,-1088:683,-1082:686,-1062:688,-1014:676,-984:678,-986:684,-977:686,-961:682,-961:673,-955:681,-947:681,-942:691,-965:701,-964:712,-952:719,-929:713,-915:702,-924:697,-906:695;-1800:-847,-1791:-841,-1744:-845,-1700:-839,-1581:-854,-1485:-856,-1431:-850,-1429:-846,-1536:-837,-1529:-820,-1568:-811,-1506:-813,-1464:-803,-1495:-794,-1553:-791,-1580:-780,-1584:-769,-1513:-774,-1461:-765,-1462:-754,-1449:-752,-1443:-755,-1352:-743,-1197:-745,-1139:-737,-1123:-747,-1006:-753,-1001:-749,-1026:-741,-1037:-726,-963:-736,-901:-733,-892:-726,-852:-735,-815:-738,-803:-731,-762:-740,-689:-730,-671:-720,-685:-697,-676:-685,-677:-673,-672:-669,-630:-646,-578:-633,-572:-635,-576:-639,-620:-648,-626:-655,-621:-662,-637:-665,-657:-680,-632:-692,-618:-707,-608:-737,-644:-753,-706:-766,-772:-767,-736:-779,-779:-784,-780:-792,-766:-799,-597:-824,-582:-832,-498:-817,-428:-821,-408:-814,-286:-803,-297:-793,-356:-795,-358:-783,-289:-767,-200:-757,-157:-745,-154:-741,-165:-739,-161:-735,-123:-724,-103:-713,-74:-717,-69:-709,-43:-715,-7:-712,-2:-716,77:-699,95:-700,108:-708,134:-700,151:-704,193:-699,226:-707,271:-705,320:-697,339:-685,386:-698,545:-658,564:-660,587:-673,614:-680,640:-674,689:-679,697:-692,678:-703,691:-707,680:-718,699:-723,710:-721,739:-699,776:-695,791:-683,828:-672,868:-672,880:-662,897:-672,958:-674,997:-672,1028:-656,1062:-669,1136:-659,1156:-667,1198:-673,1232:-665,1288:-668,1348:-662,1351:-653,1375:-670,1455:-669,1466:-679,1488:-684,1525:-689,1543:-686,1616:-706,1673:-708,1712:-717,1693:-737,1661:-744,1636:-762,1635:-771,1647:-782,1670:-788,1618:-792,1598:-810,1694:-838,1783:-845,-1800:-847;-271:835,-208:827,-314:820,-229:821,-221:817,-232:812,-158:819,-122:813,-200:802,-177:801,-197:788,-197:776,-185:770,-217:766,-198:761,-196:752,-207:752,-194:743,-216:742,-204:738,-208:735,-236:733,-223:722,-248:723,-221:715,-218:707,-235:705,-255:714,-252:708,-264:702,-224:701,-278:685,-318:681,-342:667,-398:655,-412:635,-428:627,-424:619,-434:601,-448:600,-463:608,-483:609,-492:614,-516:636,-523:652,-537:661,-533:668,-540:672,-530:684,-515:687,-509:699,-535:693,-547:696,-544:708,-514:706,-558:717,-547:726,-573:747,-613:761,-685:761,-714:770,-668:774,-710:776,-733:780,-732:784,-657:794,-653:798,-680:801,-603:820,-530:819,-504:824,-445:817,-469:822,-468:826,-434:832,-271:835;1436:-138,1439:-146,1446:-142,1454:-150,1464:-190,1488:-204,1497:-223,1507:-224,1509:-235,1531:-261,1536:-281,1529:-316,1494:-378,1483:-378,1463:-390,1449:-384,1450:-379,1436:-388,1406:-380,1396:-361,1381:-356,1382:-344,1368:-353,1379:-336,1378:-329,1360:-349,1352:-345,1343:-326,1313:-315,1262:-322,1242:-330,1237:-339,1199:-340,1180:-351,1166:-350,1150:-342,1158:-322,1146:-285,1133:-261,1138:-266,1134:-256,1142:-263,1134:-244,1142:-218,1142:-225,1167:-207,1209:-197,1230:-164,1234:-173,1239:-171,1235:-166,1238:-161,1243:-163,1257:-142,1271:-138,1284:-149,1296:-150,1294:-144,1306:-125,1326:-121,1318:-113,1324:-111,1353:-122,1365:-119,1370:-124,1360:-133,1355:-150,1402:-177,1409:-174,1417:-150,1421:-110,1425:-107,1428:-112,1436:-138;-866:732,-858:725,-848:733,-823:738,-806:727,-808:721,-778:728,-742:718,-741:713,-722:716,-679:701,-670:692,-688:687,-618:669,-639:650,-667:664,-680:663,-681:657,-653:644,-647:634,-650:627,-688:638,-662:619,-710:629,-748:647,-777:642,-786:646,-779:653,-740:655,-743:658,-726:673,-729:677,-769:689,-762:692,-790:702,-813:697,-887:704,-895:708,-885:712,-899:712,-902:722,-884:735,-858:738,-866:732;1341:-12,1344:-28,1355:-34,1363:-23,1383:-17,1446:-39,1460:-55,1476:-61,1479:-66,1470:-67,1472:-74,1487:-91,1508:-103,1500:-106,1479:-101,1460:-81,1447:-76,1433:-82,1434:-90,1426:-93,1391:-81,1376:-84,1387:-73,1379:-54,1337:-35,1330:-41,1320:-28,1337:-22,1322:-22,1305:-9,1324:-4,1341:-12;491:413,504:403,496:402,489:388,492:376,523:367,539:372,539:390,531:393,534:400,527:400,529:409,547:410,537:421,529:419,528:411,525:428,513:431,503:446,513:445,513:452,530:453,532:462,530:468,512:470,477:456,467:446,491:413;-685:831,-619:824,-677:815,-655:815,-712:798,-769:793,-755:792,-762:790,-754:785,-798:772,-779:768,-806:762,-895:765,-896:770,-878:772,-883:779,-850:775,-880:784,-851:794,-869:802,-818:805,-876:805,-916:819,-855:826,-832:823,-824:829,-793:831,-685:831;-1142:731,-1147:726,-1124:730,-1110:724,-1099:730,-1082:716,-1077:721,-1084:731,-1054:727,-1045:710,-1010:700,-1011:696,-1027:695,-1021:691,-1024:688,-1071:691,-1133:685,-1161:692,-1173:700,-1124:704,-1179:705,-1184:709,-1161:713,-1194:716,-1179:727,-1142:731;-30:586,-41:576,-20:577,-31:560,-21:559,5:529,17:527,10:518,14:513,6:508,-58:502,-34:514,-53:520,-42:523,-48:528,-46:535,-31:534,-30:540,-48:548,-50:558,-56:553,-62:568,-50:586,-30:586;-561:507,-568:498,-561:502,-555:499,-558:496,-535:492,-538:485,-531:487,-526:475,-531:467,-542:468,-542:478,-554:469,-560:469,-553:474,-562:476,-593:476,-588:482,-592:485,-574:507,-559:516,-554:516,-561:507;1179:18,1190:9,1178:8,1175:-8,1166:-15,1162:-40,1160:-37,1149:-41,1133:-31,1121:-35,1117:-30,1102:-29,1090:4,1097:20,1104:17,1112:18,1114:27,1130:31,1167:69,1192:54,1173:32,1179:18;1252:14,1237:2,1202:2,1200:-5,1209:-14,1233:-6,1215:-19,1232:-53,1222:-53,1227:-45,1215:-46,1210:-26,1203:-29,1204:-55,1194:-54,1195:-35,1188:-28,1200:6,1209:13,1229:9,1252:14;1410:371,1402:351,1372:346,1358:335,1351:338,1351:346,1310:339,1320:332,1307:310,1302:314,1304:323,1294:333,1326:354,1357:355,1367:373,1374:368,1394:382,1403:412,1414:414,1419:400,1410:371;1746:-362,1753:-372,1754:-365,1768:-379,1785:-377,1780:-392,1772:-392,1760:-413,1751:-414,1746:-413,1752:-405,1749:-399,1738:-395,1746:-388,1747:-374,1726:-345,1743:-353,1746:-362;1213:185,1222:185,1225:171,1217:159,1217:143,1240:138,1241:125,1233:130,1229:136,1227:132,1220:138,1206:139,1210:145,1201:150,1199:164,1203:160,1207:185,1213:185;1264:84,1265:72,1262:63,1258:73,1254:68,1254:56,1242:62,1242:74,1236:78,1228:75,1221:69,1223:80,1255:90,1254:98,1262:93,1264:84;-947:771,-916:768,-907:764,-910:761,-892:756,-811:757,-801:753,-798:749,-805:747,-882:744,-924:748,-929:759,-939:763,-971:768,-968:772,-947:771;501:-136,504:-157,497:-157,498:-169,471:-249,454:-256,440:-250,434:-213,444:-201,440:-174,444:-162,463:-158,477:-146,492:-120,501:-136;1436:508,1446:490,1432:493,1426:479,1435:468,1435:461,1428:467,1421:460,1421:496,1416:519,1417:533,1426:538,1422:542,1426:544,1436:508;575:707,537:708,516:715,515:720,544:736,535:738,559:746,556:751,612:762,682:769,688:765,585:743,554:724,556:715,575:707;-145:665,-147:658,-136:651,-187:635,-228:640,-218:644,-240:649,-222:651,-243:656,-236:663,-221:664,-206:657,-191:663,-145:665;-1082:762,-1059:760,-1057:755,-1063:750,-1137:744,-1139:747,-1118:752,-1163:750,-1177:752,-1154:765,-1091:755,-1105:764,-1096:768,-1082:762;1730:-409,1742:-414,1727:-434,1731:-438,1714:-442,1706:-459,1684:-466,1667:-462,1670:-451,1705:-430,1721:-410,1728:-405,1730:-409;1058:-58,1047:-59,1026:-42,986:18,954:50,953:55,975:52,1006:21,1017:21,1038:1,1034:-7,1061:-31,1058:-58;1439:442,1453:444,1455:433,1441:430,1432:420,1416:427,1411:416,1400:416,1398:426,1403:433,1414:434,1420:456,1439:442;-870:797,-858:793,-908:782,-940:788,-932:794,-961:797,-967:802,-943:810,-947:812,-924:813,-878:803,-870:797;-678:-538,-650:-547,-655:-552,-670:-549,-682:-556,-723:-545,-747:-528,-711:-541,-694:-525,-686:-526,-678:-538;-726:199,-700:196,-683:186,-687:182,-710:183,-714:176,-724:182,-745:183,-723:187,-734:196,-726:199;-797:228,-742:203,-778:199,-771:204,-793:216,-818:222,-822:224,-818:226,-850:219,-823:232,-797:228;-684:-710,-688:-722,-711:-725,-750:-721,-750:-717,-739:-713,-721:-712,-717:-695,-702:-689,-684:-710;1454:-408,1483:-409,1484:-421,1479:-432,1476:-429,1469:-436,1460:-436,1447:-412,1447:-407,1454:-408;1520:-55,1497:-63,1483:-58,1498:-55,1500:-50,1508:-55,1516:-48,1515:-42,1521:-42,1520:-55;1255:122,1258:110,1250:113,1253:104,1248:101,1245:109,1243:115,1249:118,1243:126,1255:122;-852:657,-801:637,-826:636,-831:641,-855:630,-859:636,-872:635,-864:640,-859:657,-852:657;-1004:738,-971:735,-980:730,-965:726,-967:717,-984:713,-1025:725,-1004:727,-1015:734,-1004:738;-1205:714,-1231:709,-1259:719,-1239:737,-1249:743,-1215:744,-1176:742,-1155:735,-1192:725,-1205:714;182:797,215:790,190:786,171:768,138:774,147:777,132:780,104:796,170:800,182:797;1086:-68,1105:-69,1108:-65,1157:-84,1146:-88,1106:-81,1054:-68,1060:-59,1086:-68;1287:11,1286:3,1281:4,1280:-2,1284:-8,1277:-3,1276:18,1279:22,1287:11;1240:103,1230:90,1224:97,1228:103,1230:109,1235:109,1233:103,1241:112,1240:103;-452:-780,-439:-785,-433:-800,-505:-810,-542:-806,-510:-796,-487:-780,-452:-780;-985:767,-977:763,-982:750,-1009:751,-1009:756,-1025:756,-1026:763,-985:767;-1001:783,-997:779,-1013:780,-1052:784,-1042:787,-1055:793,-1035:792,-1001:783';
GEO.world = WORLD_110.split(';').map((ring) =>
  ring.split(',').map((pt) => {
    const i = pt.indexOf(':');
    return [+pt.slice(0, i) / 10, +pt.slice(i + 1) / 10];
  })
);

/* The finer set is a progressive enhancement for the zoomed beats only. If it
   is missing the coarse one is used and nothing breaks. */
const grab = (u) => fetch(u).then((r) => r.ok ? r.json() : null).catch(() => null);
Promise.all([grab('/assets/data/world-50m.json'), grab('/assets/data/bengaluru.json')])
  .then(([w50, b]) => { GEO.world50 = w50 && w50.rings; GEO.blr = b; redrawAll(); });

const REDRAWS = [];
function redrawAll() { REDRAWS.forEach((f) => { try { f(); } catch (e) {} }); }
const PROJECTS = window.PROJECTS || [];
const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const cssVar = (n) => getComputedStyle(document.documentElement).getPropertyValue('--' + n).trim();
const C = {
  active: cssVar('active'), water: cssVar('water'), form: cssVar('form'),
  sensing: cssVar('sensing'), network: cssVar('network'), dim: cssVar('text-3')
};

function rng(seed) { let s = seed >>> 0; return () => { s ^= s << 13; s ^= s >>> 17; s ^= s << 5; return ((s >>> 0) % 100000) / 100000; }; }
function fitCanvas(cv) {
  const dpr = Math.min(devicePixelRatio || 1, 2), r = cv.getBoundingClientRect();
  cv.width = Math.max(1, r.width * dpr); cv.height = Math.max(1, r.height * dpr);
  const ctx = cv.getContext('2d'); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, w: r.width, h: r.height };
}

/* ---------------- cities ---------------- */
/* grain = intersections per km2 at the 10 km ball, from the morphology study.
   Only the five study cities carry a value. */
const CITIES = [
  { n: 'BENGALURU', lat: 12.97, lon: 77.59, tier: 'study', c: C.active, grain: 135.6 },
  { n: 'LONDON', lat: 51.51, lon: -0.13, tier: 'research', c: C.network },
  { n: 'DELHI', lat: 28.61, lon: 77.21, tier: 'comparison', c: C.form, grain: 74.2 },
  { n: 'MUMBAI', lat: 19.08, lon: 72.88, tier: 'comparison', c: C.form, grain: 57.9 },
  { n: 'KOLKATA', lat: 22.57, lon: 88.36, tier: 'comparison', c: C.form, grain: 81.8 },
  { n: 'CHENNAI', lat: 13.08, lon: 80.27, tier: 'comparison', c: C.form, grain: 90.4 },
  { n: 'DUBAI', lat: 25.20, lon: 55.27, tier: 'writing', c: C.water }
];
const TIER_PRIO = { study: 0, research: 1, comparison: 2, writing: 3 };

/* Draws lat/lon rings onto a sphere, hiding anything on the far side. */
function strokeRings(ctx, rings, cx, cy, R, rotRad, style, width) {
  if (!rings) return;
  ctx.strokeStyle = style; ctx.lineWidth = width;
  for (const ring of rings) {
    let pen = false;
    ctx.beginPath();
    for (let i = 0; i < ring.length; i++) {
      const la = ring[i][1] * Math.PI / 180, lo = ring[i][0] * Math.PI / 180 + rotRad;
      const z = Math.cos(la) * Math.cos(lo);
      if (z <= 0) { pen = false; continue; }
      const x = cx + Math.cos(la) * Math.sin(lo) * R, y = cy - Math.sin(la) * R;
      if (!pen) { ctx.moveTo(x, y); pen = true; } else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
}

/* Flat equirectangular draw, for the close range where curvature is irrelevant. */
function strokeFlat(ctx, rings, cx, cy, ppd, lat0, lon0, style, width, close) {
  if (!rings) return;
  const k = Math.cos(lat0 * Math.PI / 180);
  ctx.strokeStyle = style; ctx.lineWidth = width;
  for (const ring of rings) {
    ctx.beginPath();
    for (let i = 0; i < ring.length; i++) {
      const x = cx + (ring[i][0] - lon0) * ppd * k, y = cy - (ring[i][1] - lat0) * ppd;
      i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    }
    if (close) ctx.closePath();
    ctx.stroke();
  }
}

function drawMarker(ctx, city, px, py, t) {
  if (city.tier === 'study') {
    ctx.beginPath(); ctx.arc(px, py, 3.4, 0, 7); ctx.fillStyle = city.c; ctx.fill();
    ctx.beginPath(); ctx.arc(px, py, 9 + Math.sin(t * 0.03) * 2.2, 0, 7);
    ctx.strokeStyle = 'rgba(166,248,196,.45)'; ctx.lineWidth = 1; ctx.stroke();
  } else if (city.tier === 'research' || city.tier === 'writing') {
    ctx.beginPath(); ctx.arc(px, py, 3, 0, 7); ctx.fillStyle = city.c; ctx.fill();
  } else {
    ctx.strokeStyle = city.c; ctx.lineWidth = 1.1;
    ctx.beginPath(); ctx.arc(px, py, 3, 0, 7); ctx.stroke();
  }
}

function placeLabels(ctx, labels) {
  labels.sort((a, b) => TIER_PRIO[a.city.tier] - TIER_PRIO[b.city.tier]);
  const placed = [];
  for (const L of labels) {
    const tw = ctx.measureText(L.text).width;
    const spots = [[15, 3.4], [15, -9], [-tw - 15, 3.4], [15, 15], [-tw - 15, -9]];
    let box = null;
    for (const [dx, dy] of spots) {
      const b = { x: L.px + dx, y: L.py + dy - 9, w: tw + 6, h: 13 };
      if (!placed.some((q) => !(b.x > q.x + q.w || b.x + b.w < q.x || b.y > q.y + q.h || b.y + b.h < q.y))) { box = b; break; }
    }
    if (!box) continue;
    placed.push(box);
    ctx.globalAlpha = L.fade;
    ctx.fillStyle = L.city.tier === 'study' ? 'rgba(238,241,234,.95)' : 'rgba(165,180,177,.75)';
    ctx.fillText(L.text, box.x, box.y + 9.6);
    ctx.globalAlpha = 1;
  }
}

/* ---------------- hero and closing globe ---------------- */
function globeField(canvas, opts) {
  const o = Object.assign({ count: 1200, spin: 0.00003, seed: 7, right: true, labels: true, phase: -1.354 }, opts || {});
  let ctx, w, h, pts = [], raf = null, t = 0, vis = true;
  const r0 = rng(o.seed);
  for (let i = 0; i < o.count; i++) pts.push({ th: 2 * Math.PI * r0(), ph: Math.acos(2 * r0() - 1), s: 0.5 + r0() * 0.9 });
  const size = () => { const f = fitCanvas(canvas); ctx = f.ctx; w = f.w; h = f.h; };
  const rot = () => o.phase + t * o.spin * 60;

  function draw() {
    ctx.clearRect(0, 0, w, h);
    const R = Math.min(w, h) * (o.radius || 0.42);
    const cx = o.right ? w * (w > 900 ? 0.68 : 0.5) : w * 0.5;
    const cy = h * 0.5;
    const desk = w > 900;                      // point 2: desktop was too faint
    const gA = desk ? 0.34 : 0.26;             // graticule
    const dotBoost = desk ? 1.55 : 1.0;        // land dots
    ctx.strokeStyle = `rgba(56,78,78,${gA})`; ctx.lineWidth = 1;
    for (let k = -60; k <= 60; k += 30) {
      ctx.beginPath();
      for (let a = 0; a <= 180; a += 3) {
        const lon = (a / 180) * Math.PI * 2 + rot(), lat = k * Math.PI / 180;
        const x = Math.cos(lat) * Math.sin(lon), z = Math.cos(lat) * Math.cos(lon), y = Math.sin(lat);
        if (z < 0) { ctx.moveTo(cx + x * R, cy - y * R); continue; }
        a === 0 ? ctx.moveTo(cx + x * R, cy - y * R) : ctx.lineTo(cx + x * R, cy - y * R);
      }
      ctx.stroke();
    }
    for (let m = 0; m < 12; m++) {
      ctx.beginPath();
      const lon = (m / 12) * Math.PI * 2 + rot();
      for (let b = -90; b <= 90; b += 4) {
        const lat = b * Math.PI / 180;
        const x = Math.cos(lat) * Math.sin(lon), z = Math.cos(lat) * Math.cos(lon), y = Math.sin(lat);
        if (z < 0) { ctx.moveTo(cx + x * R, cy - y * R); continue; }
        b === -90 ? ctx.moveTo(cx + x * R, cy - y * R) : ctx.lineTo(cx + x * R, cy - y * R);
      }
      ctx.stroke();
    }
    for (const p of pts) {
      const lon = p.th + rot(), lat = Math.PI / 2 - p.ph;
      const x = Math.cos(lat) * Math.sin(lon), z = Math.cos(lat) * Math.cos(lon), y = Math.sin(lat);
      if (z < 0) continue;
      const a = Math.min(1, (0.16 + z * 0.72) * dotBoost);
      ctx.fillStyle = `rgba(166,248,196,${a})`;
      ctx.fillRect(cx + x * R, cy - y * R, p.s * 1.25 * (desk ? 1.15 : 1), p.s * 1.25 * (desk ? 1.15 : 1));
    }
    strokeRings(ctx, GEO.world, cx, cy, R, rot(),
      desk ? 'rgba(176,216,206,.80)' : 'rgba(176,216,206,.62)', 1);
    ctx.font = '9.5px "JetBrains Mono", monospace';
    const labels = [];
    for (const city of CITIES) {
      const lat = city.lat * Math.PI / 180, lon = city.lon * Math.PI / 180 + rot();
      const x = Math.cos(lat) * Math.sin(lon), z = Math.cos(lat) * Math.cos(lon), y = Math.sin(lat);
      if (z <= 0.02) continue;
      const px = cx + x * R, py = cy - y * R, fade = Math.min(1, (z - 0.02) / 0.28);
      ctx.globalAlpha = fade; drawMarker(ctx, city, px, py, t); ctx.globalAlpha = 1;
      if (o.labels && z > 0.30 && w > 640) labels.push({ city, px, py, fade, text: city.n });
    }
    placeLabels(ctx, labels);
  }
  const loop = () => { if (!vis) { raf = null; return; } t += 1; draw(); raf = requestAnimationFrame(loop); };
  size(); draw();
  REDRAWS.push(() => { size(); draw(); });
  if (!RM) {
    new IntersectionObserver((es) => { vis = es[0].isIntersecting; if (vis && !raf) raf = requestAnimationFrame(loop); }, { threshold: 0.02 }).observe(canvas);
  }
  addEventListener('resize', () => { size(); draw(); });
}

if ($('#heroCanvas')) globeField($('#heroCanvas'), { count: 5200, seed: 11, radius: 0.43, spin: 0.00003 });
if ($('#closeCanvas')) globeField($('#closeCanvas'), { count: 4000, seed: 29, radius: 0.40, spin: 0.000022, phase: -1.15 });

(function boot() {
  const el = $('#bootLine'); if (!el) return;
  if (RM) return;
  const seq = ['SYSTEM / READY', 'ACQUIRING / 001', 'OBSERVE / 001'];
  let i = 0; const id = setInterval(() => { el.textContent = seq[i++]; if (i >= seq.length) clearInterval(id); }, 260);
})();

/* ---------------- descent: earth, subcontinent, street ---------------- */
(function descent() {
  const sec = $('.descent'), cv = $('#scaleCanvas'); if (!sec || !cv) return;
  let ctx, w, h;
  const STEPS = [
    { p: 0.00, name: 'EARTH', scale: '1:40,000,000', state: 'NATURAL EARTH COASTLINE',
      t: 'From the planet<br>to the street.',
      b: 'Seven cities carry work on this site. One is the subject, one is where the research was done, four are the comparison set, and one turns up in an essay about pace.' },
    { p: 0.34, name: 'SUBCONTINENT', scale: '1:4,000,000', state: 'MEASURED / 10 KM NETWORK BALL',
      t: 'Five cities,<br>cut the same way.',
      b: 'Delhi, Mumbai, Kolkata, Chennai and Bengaluru, each measured inside a ten kilometre network distance ball from its historic core. Not a municipal boundary, not a circle. The number beside each city is intersections per square kilometre.' },
    { p: 0.68, name: 'BENGALURU', scale: '1:40,000', state: 'DISTRICT BOUNDARY / OSM',
      t: 'And into<br>Bengaluru.',
      b: 'The finest grained of the five. 136 intersections per square kilometre, streets averaging 59 metres, and the most direct routes in the set.' }
  ];
  const rc = rng(4242);
  const cloud = Array.from({ length: 1600 }, () => ({ th: 2 * Math.PI * rc(), ph: Math.acos(2 * rc() - 1), s: 0.4 + rc() * 0.8 }));
  const fallback = (() => {
    const g = rng(99), lines = [];
    for (let i = 0; i < 64; i++) { const y = g(); lines.push([[0, y], [1, y + (g() - 0.5) * 0.10]]); }
    for (let i = 0; i < 64; i++) { const x = g(); lines.push([[x, 0], [x + (g() - 0.5) * 0.10, 1]]); }
    return lines;
  })();
  const size = () => { const f = fitCanvas(cv); ctx = f.ctx; w = f.w; h = f.h; };
  const sstep = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
  const PHASE = -1.354;   // locked so India faces the viewer throughout
  const BLR = [77.5946, 12.9716];
  const LOCAL = { lat: BLR[1], lon: BLR[0] };
  let fitCache = null;
  function blrFit() {
    if (fitCache !== null) return fitCache;
    const src = GEO.blr && (GEO.blr.district || GEO.blr.roads || GEO.blr.water);
    if (!src || !src.length) return (fitCache = false);
    let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
    for (const ring of src) for (const [lon, lat] of ring) {
      if (lon < x0) x0 = lon; if (lon > x1) x1 = lon;
      if (lat < y0) y0 = lat; if (lat > y1) y1 = lat;
    }
    const lat = (y0 + y1) / 2, lon = (x0 + x1) / 2;
    const span = Math.max((x1 - x0) * Math.cos(lat * Math.PI / 180), y1 - y0) || 1;
    return (fitCache = { lat, lon, span });
  }

  function draw(p) {
    ctx.clearRect(0, 0, w, h);
    const desk = w > 900;
    const cx0 = w * (desk ? 0.30 : 0.5), cy0 = h * (desk ? 0.5 : 0.30);
    const proj = (latDeg, lonDeg) => {
      const la = latDeg * Math.PI / 180, lo = lonDeg * Math.PI / 180 + PHASE;
      return { x: Math.cos(la) * Math.sin(lo), z: Math.cos(la) * Math.cos(lo), y: Math.sin(la) };
    };
    const R = Math.min(w, h) * ((desk ? 0.34 : 0.26) + Math.pow(p, 1.35) * (desk ? 2.0 : 1.5));
    const follow = sstep(0.06, 0.38, p);
    const ctr = proj(20.5, 79.0);
    const cx = cx0 - ctr.x * R * follow, cy = cy0 + ctr.y * R * follow;

    const globeA = Math.max(0, 1 - Math.max(0, p - 0.55) / 0.30);
    const cityA  = sstep(0.12, 0.32, p) * (1 - sstep(0.66, 0.88, p));
    const localA = sstep(0.66, 0.86, p);

    if (globeA > 0.01) {
      for (const q of cloud) {
        const lon = q.th + PHASE, la = Math.PI / 2 - q.ph;
        const x = Math.cos(la) * Math.sin(lon), z = Math.cos(la) * Math.cos(lon), y = Math.sin(la);
        if (z < 0) continue;
        ctx.fillStyle = `rgba(166,248,196,${Math.min(1, (0.22 + z * 0.62) * globeA * (desk ? 1.6 : 1.3))})`;
        ctx.fillRect(cx + x * R, cy - y * R, q.s, q.s);
      }
      ctx.strokeStyle = `rgba(70,96,99,${0.7 * globeA})`; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.stroke();
      // swap to the finer coastline once the sphere is big enough to show it
      const coast = (p > 0.10 && GEO.world50) ? GEO.world50 : GEO.world;
      strokeRings(ctx, coast, cx, cy, R, PHASE, `rgba(176,216,206,${0.92 * globeA})`, desk ? 1.1 : 1);
    }

    /* Close range. The sphere radius is nowhere near enough to reach city scale,
       so past the handoff the projection blends from the sphere to a flat frame
       sized to the district itself. */
    if (localA > 0.01) {
      const bp = proj(BLR[1], BLR[0]);
      let bx = cx + bp.x * R, by = cy - bp.y * R;
      let ppd = R * Math.PI / 180;
      const fit = blrFit();
      if (fit) {
        const k = sstep(0.70, 0.97, p);
        const target = Math.min(w, h) * 0.72 / fit.span;
        ppd = ppd * (1 - k) + target * k;
        // slide the frame onto the district centre as the flat view takes over
        const cLon = cx + proj(fit.lat, fit.lon).x * R, cLat = cy - proj(fit.lat, fit.lon).y * R;
        bx = cLon * (1 - k) + (desk ? w * 0.34 : w * 0.5) * k;
        by = cLat * (1 - k) + (desk ? h * 0.5 : h * 0.34) * k;
        LOCAL.lat = fit.lat; LOCAL.lon = fit.lon;
      }
      if (GEO.blr) {
        const la = LOCAL.lat, lo = LOCAL.lon;
        strokeFlat(ctx, GEO.blr.roads, bx, by, ppd, la, lo, `rgba(130,172,166,${0.48 * localA})`, 0.7);
        strokeFlat(ctx, GEO.blr.water, bx, by, ppd, la, lo, `rgba(115,207,229,${0.60 * localA})`, 1, true);
        strokeFlat(ctx, GEO.blr.district, bx, by, ppd, la, lo, `rgba(166,248,196,${0.85 * localA})`, 1.4, true);
      } else {
        const S = Math.max(w, h) * 2.4, ox = bx - S / 2, oy = by - S / 2;
        ctx.strokeStyle = `rgba(110,150,145,${0.40 * localA})`; ctx.lineWidth = 0.8;
        for (const l of fallback) {
          ctx.beginPath();
          ctx.moveTo(ox + l[0][0] * S, oy + l[0][1] * S);
          ctx.lineTo(ox + l[1][0] * S, oy + l[1][1] * S);
          ctx.stroke();
        }
      }
    }

    if (cityA > 0.01) {
      const pos = {};
      for (const city of CITIES) {
        const q = proj(city.lat, city.lon);
        if (q.z <= 0.02) continue;
        pos[city.n] = { px: cx + q.x * R, py: cy - q.y * R, city };
      }
      const blr = pos['BENGALURU'];
      if (blr) {
        ctx.strokeStyle = `rgba(249,172,117,${0.35 * cityA})`; ctx.lineWidth = 1; ctx.setLineDash([3, 4]);
        for (const n of ['DELHI', 'MUMBAI', 'KOLKATA', 'CHENNAI']) {
          if (!pos[n]) continue;
          ctx.beginPath(); ctx.moveTo(blr.px, blr.py); ctx.lineTo(pos[n].px, pos[n].py); ctx.stroke();
        }
        ctx.setLineDash([]);
      }
      ctx.font = '10px "JetBrains Mono", monospace';
      const labels = [];
      for (const k in pos) {
        const { px, py, city } = pos[k];
        ctx.globalAlpha = cityA; drawMarker(ctx, city, px, py, 0); ctx.globalAlpha = 1;
        // the grain value needs room; on a phone the name alone already crowds
        labels.push({ city, px, py, fade: cityA, text: (city.grain && w > 640) ? `${city.n}  ${city.grain}` : city.n });
      }
      placeLabels(ctx, labels);
    }
  }

  let cur = null, lastP = 0;
  function onScroll() {
    const rect = sec.getBoundingClientRect();
    const total = sec.offsetHeight - innerHeight;
    lastP = Math.min(1, Math.max(0, (-rect.top) / Math.max(1, total)));
    draw(lastP);
    let st = STEPS[0];
    for (const x of STEPS) if (lastP >= x.p) st = x;
    if (cur !== st.name) {
      cur = st.name;
      $('#scaleName').textContent = st.name;
      $('#scaleValue').textContent = st.scale;
      $('#scaleState').textContent = (st.name === 'BENGALURU' && !GEO.blr) ? 'SCHEMATIC / AWAITING SHAPEFILE' : st.state;
      $('#descentTitle').innerHTML = st.t;
      $('#descentBody').textContent = st.b;
    }
  }
  size(); onScroll();
  REDRAWS.push(() => { size(); cur = null; fitCache = null; onScroll(); });
  addEventListener('resize', () => { size(); onScroll(); });
  addEventListener('scroll', () => requestAnimationFrame(onScroll), { passive: true });
})();

/* ---------------- atlas map ---------------- */
let activeFilter = 'ALL';
let activeId = PROJECTS.length ? PROJECTS[0].id : null;
const MARKER_POS = { isochronic: [0.30, 0.66], geometry: [0.71, 0.58], sensing: [0.22, 0.32], speed: [0.58, 0.28], scenario: [0.80, 0.30], water: [0.47, 0.80] };

function drawAtlas() {
  const cv = $('#atlasCanvas'); if (!cv) return;
  const { ctx, w, h } = fitCanvas(cv);
  ctx.clearRect(0, 0, w, h);
  const g = rng(1337);
  ctx.strokeStyle = 'rgba(38,53,53,.42)'; ctx.lineWidth = 1;
  for (let x = 0; x < w; x += 64) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
  for (let y = 0; y < h; y += 64) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
  const dom = activeFilter === 'ALL' ? null : activeFilter;
  const streetAlpha = dom && dom !== 'FORM' ? 0.28 : 0.55;
  const cx = w * 0.44, cy = h * 0.52;

  for (let i = 0; i < 14; i++) {
    const a = (i / 14) * Math.PI * 2 + 0.3;
    ctx.strokeStyle = `rgba(120,160,155,${streetAlpha * 0.9})`; ctx.lineWidth = 1.3;
    const gap = (Math.min(w, h) / 13) * (0.10 + g() * 0.30);
    let px = cx + Math.cos(a) * gap, py = cy + Math.sin(a) * gap;
    ctx.beginPath(); ctx.moveTo(px, py);
    for (let s = 1; s <= 10; s++) {
      const j = (g() - 0.5) * 0.22;
      px += Math.cos(a + j) * (Math.max(w, h) / 13); py += Math.sin(a + j) * (Math.max(w, h) / 13);
      ctx.lineTo(px, py);
    }
    ctx.stroke();
  }
  for (let r = 1; r <= 6; r++) {
    ctx.strokeStyle = `rgba(120,160,155,${streetAlpha * 0.5})`; ctx.lineWidth = 0.9;
    ctx.beginPath();
    const rad = (Math.min(w, h) / 13) * r * 1.35;
    for (let a = 0; a <= 6.4; a += 0.16) {
      const wob = 1 + Math.sin(a * 3 + r) * 0.05;
      const x = cx + Math.cos(a) * rad * wob, y = cy + Math.sin(a) * rad * wob * 0.82;
      a === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  for (let i = 0; i < 240; i++) {
    const bias = g();
    const x = cx + (g() - 0.5) * w * (0.55 + bias * 0.8), y = cy + (g() - 0.5) * h * (0.55 + bias * 0.8), l = 14 + g() * 70;
    ctx.strokeStyle = `rgba(110,150,145,${streetAlpha * 0.5})`; ctx.lineWidth = 0.7;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + (g() > 0.5 ? l : 0), y + (g() > 0.5 ? 0 : l)); ctx.stroke();
  }
  if (!dom || dom === 'WATER') {
    const a = dom === 'WATER' ? 0.85 : 0.3;
    for (let i = 0; i < 7; i++) {
      const x = g() * w, y = g() * h, rr = 16 + g() * 44;
      ctx.beginPath();
      for (let k = 0; k <= 18; k++) {
        const ang = (k / 18) * Math.PI * 2, rad = rr * (0.7 + Math.sin(ang * 3 + i) * 0.22);
        const px = x + Math.cos(ang) * rad, py = y + Math.sin(ang) * rad * 0.72;
        k === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fillStyle = `rgba(115,207,229,${a * 0.16})`; ctx.fill();
      ctx.strokeStyle = `rgba(115,207,229,${a})`; ctx.lineWidth = 1; ctx.stroke();
    }
  }
  if (dom === 'SENSING') {
    for (let i = 0; i < 26; i++) {
      const x = g() * w, y = g() * h;
      ctx.beginPath(); ctx.arc(x, y, 2.2, 0, 7); ctx.fillStyle = C.sensing; ctx.fill();
      ctx.beginPath(); ctx.arc(x, y, 10, 0, 7); ctx.strokeStyle = 'rgba(230,155,201,.35)'; ctx.stroke();
    }
  }
  if (dom === 'FORM') {
    for (let i = 0; i < 150; i++) {
      const x = g() * w, y = g() * h, s = 4 + g() * 16;
      ctx.fillStyle = `rgba(249,172,117,${0.08 + g() * 0.22})`; ctx.fillRect(x, y, s, s * 0.72);
    }
  }
  if (dom === 'PACE') {
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2;
      ctx.strokeStyle = 'rgba(166,248,196,.5)'; ctx.lineWidth = 2.4;
      ctx.beginPath(); ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(a) * Math.min(w, h) * (0.18 + g() * 0.34), cy + Math.sin(a) * Math.min(w, h) * (0.18 + g() * 0.34));
      ctx.stroke();
    }
  }
  if (dom === 'ACCESS' || dom === 'SCENARIO') {
    const col = dom === 'ACCESS' ? '191,154,255' : '115,207,229';
    for (let r = 1; r <= 3; r++) {
      ctx.strokeStyle = `rgba(${col},${0.75 - r * 0.16})`; ctx.setLineDash([5, 5]); ctx.lineWidth = 1.3;
      ctx.beginPath();
      const rad = Math.min(w, h) * 0.12 * r;
      for (let a = 0; a <= 6.4; a += 0.1) {
        const wob = 1 + Math.sin(a * 4 + r * 2) * 0.16;
        const x = cx + Math.cos(a) * rad * wob, y = cy + Math.sin(a) * rad * wob * 0.85;
        a === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.closePath(); ctx.stroke(); ctx.setLineDash([]);
    }
  }
}

function renderMarkers() {
  const wrap = $('#mapWrap'); if (!wrap) return;
  wrap.querySelectorAll('.marker').forEach((n) => n.remove());
  PROJECTS.forEach((p) => {
    if (activeFilter !== 'ALL' && p.domain !== activeFilter) return;
    const pos = MARKER_POS[p.id] || [0.5, 0.5];
    const b = document.createElement('button');
    b.className = 'marker';
    b.style.left = pos[0] * 100 + '%'; b.style.top = pos[1] * 100 + '%';
    b.style.color = `var(--${p.color})`;
    b.setAttribute('aria-pressed', String(p.id === activeId));
    b.innerHTML = `<i></i><span style="color:var(--text-2)">${esc(p.domain)}</span>`;
    b.addEventListener('click', () => select(p.id));
    wrap.appendChild(b);
  });
}

function renderFilters() {
  const doms = ['ALL', ...new Set(PROJECTS.map((p) => p.domain))];
  $('#filters').innerHTML = doms.map((d) => `<button class="chip" data-f="${d}" aria-pressed="${d === activeFilter}">${d}</button>`).join('');
  $$('#filters .chip').forEach((b) => b.addEventListener('click', () => {
    activeFilter = b.dataset.f; renderFilters(); renderRows(); renderMarkers(); drawAtlas();
  }));
}

function renderRows() {
  const list = PROJECTS.filter((p) => activeFilter === 'ALL' || p.domain === activeFilter);
  const live = list.filter((p) => p.stage === 'live');
  const rest = list.filter((p) => p.stage !== 'live');
  $('#signalCount').textContent = `${String(live.length).padStart(2, '0')} LIVE / ${String(rest.length).padStart(2, '0')} NOT YET`;
  const full = (p) => `
    <button class="row" data-id="${p.id}" aria-pressed="${p.id === activeId}" style="color:var(--${p.color})">
      <span class="row-meta"><span>${p.num} / ${esc(p.domain)} / ${esc(p.place)}</span><span class="status">${esc(p.maturity)}</span></span>
      <h3>${esc(p.question)}</h3>
      <p>${esc(p.blurb)}</p>
      ${p.href ? '<span class="open">FULL PROJECT PAGE</span>' : ''}
    </button>`;
  const thin = (p) => `
    <button class="row thin" data-id="${p.id}" aria-pressed="${p.id === activeId}" style="color:var(--${p.color})">
      <span class="row-meta"><span>${p.num} / ${esc(p.domain)}</span><span class="status">${esc(p.maturity)}</span></span>
      <h3>${esc(p.question)}</h3>
    </button>`;
  $('#rows').innerHTML = live.map(full).join('')
    + (rest.length ? '<div class="rows-divider">NOT YET</div>' + rest.map(thin).join('') : '');
  $$('#rows .row').forEach((b) => b.addEventListener('click', () => select(b.dataset.id)));
}

function select(id) {
  activeId = id;
  renderRows(); renderMarkers(); drawAtlas();
  renderInvestigation(PROJECTS.find((p) => p.id === id));
  $('#investigation').scrollIntoView({ behavior: RM ? 'auto' : 'smooth', block: 'start' });
}

/* ---------------- block renderer ---------------- */
function block(b) {
  switch (b.type) {
    case 'prose':
      return `${b.kicker ? `<p class="kicker">${esc(b.kicker)}</p>` : ''}
        ${b.h ? `<h3>${esc(b.h)}</h3>` : ''}
        ${(b.p || []).map((t) => `<p>${esc(t)}</p>`).join('')}`;
    case 'note':
      return `<div class="note">${b.label ? `<b>${esc(b.label)}</b>` : ''}<span>${esc(b.text)}</span></div>`;
    case 'steps':
      return `<ol class="steps">${b.items.map((m, i) =>
        `<li><span class="n">${String(i + 1).padStart(2, '0')}</span><span><b>${esc(m[0])}</b><span>${esc(m[1])}</span></span></li>`).join('')}</ol>`;
    case 'list':
      return `${b.kicker ? `<p class="kicker">${esc(b.kicker)}</p>` : ''}${b.h ? `<h3>${esc(b.h)}</h3>` : ''}
        <ul class="deflist">${b.items.map((m) => `<li><b>${esc(m[0])}</b><span>${esc(m[1])}</span></li>`).join('')}</ul>`;
    case 'pending':
      return `<p class="kicker">NOT DEFINED YET</p><h3>What this needs before it can say anything.</h3>
        <ul class="deflist">${b.items.map((m) => `<li><b>${esc(m[0])}</b><span><span class="pending">PENDING</span> ${esc(m[1])}</span></li>`).join('')}</ul>`;
    case 'table':
      return `${b.kicker ? `<p class="kicker">${esc(b.kicker)}</p>` : ''}${b.h ? `<h3>${esc(b.h)}</h3>` : ''}
        <div class="table-scroll"><table class="dtable">
          <thead><tr>${b.head.map((x) => `<th>${esc(x)}</th>`).join('')}</tr></thead>
          <tbody>${b.rows.map((r) => `<tr>${r.map((x) => `<td>${esc(x)}</td>`).join('')}</tr>`).join('')}</tbody>
        </table></div>${b.foot ? `<p class="tfoot">${esc(b.foot)}</p>` : ''}`;
    case 'findings':
      return `<div class="findings">${b.items.map((m) => `<div><b>${esc(m[0])}</b><span>${esc(m[1])}</span></div>`).join('')}</div>`;
    case 'graph':
      return graphPanel();
    default:
      return '';
  }
}

function graphPanel() {
  return `<div class="two">
    <div>
      <div class="graph-wrap">
        <canvas class="graph-canvas"></canvas>
        <div class="graph-hud">SCHEMATIC WALKING GRAPH / ILLUSTRATIVE COSTS</div>
        <div class="graph-legend">
          <span><i class="swatch" style="background:var(--rule-strong)"></i>network</span>
          <span><i class="swatch" style="background:var(--network)"></i>reachable</span>
          <span><i class="swatch" style="background:var(--active)"></i>new reach</span>
        </div>
      </div>
      <div class="controls">
        <div class="timepick" role="group" aria-label="Travel time budget">
          <button class="chip" data-t="5">5 MIN</button>
          <button class="chip" data-t="10">10 MIN</button>
          <button class="chip" data-t="15">15 MIN</button>
        </div>
        <button class="chip scen-toggle">ADD CROSSING</button>
        <span class="range-out js-reach"></span>
      </div>
    </div>
    <div>
      <p class="kicker">THE PRINCIPLE, AT ITS SMALLEST</p>
      <h3>Reach follows the graph.</h3>
      <p>One origin, a walking network and a barrier cutting a corridor in two. Raise the time budget and reach grows along routes, not outward as a circle. Add the crossing and the same budget reaches the far side.</p>
      <div class="deltabox js-delta"></div>
      <p class="fill">Generated geometry, fixed illustrative walking speed. This demonstrates the logic behind the thesis and the scenario simulator. It is not a result for London or anywhere else, and no real segment, population or amenity count is claimed.</p>
    </div>
  </div>`;
}

function renderInvestigation(p) {
  if (!p) return;
  $('#invLabel').textContent = `${p.num} / ${p.domain}`;
  $('#invQuestion').textContent = p.question;
  $('#invNote').textContent = p.note;

  $('#tabs').innerHTML = p.views.map((v, i) =>
    `<button class="tab" role="tab" id="t-${v.id}" aria-controls="p-${v.id}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">${esc(v.label)}</button>`).join('');

  $('#panels').innerHTML = p.views.map((v, i) => `
    <div class="tabpanel" role="tabpanel" id="p-${v.id}" aria-labelledby="t-${v.id}" ${i === 0 ? '' : 'hidden'}>
      ${v.blocks.map(block).join('')}
      ${p.href ? `<a class="open-link" href="${p.href}">Open the full project page</a>` : ''}
    </div>`).join('');

  const keys = p.views.map((v) => v.id);
  keys.forEach((k, i) => {
    const t = $('#t-' + k);
    t.addEventListener('click', () => activateTab(keys, k));
    t.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      e.preventDefault();
      const n = (i + (e.key === 'ArrowRight' ? 1 : -1) + keys.length) % keys.length;
      activateTab(keys, keys[n]); $('#t-' + keys[n]).focus();
    });
  });
  if ($('.graph-canvas')) wireGraph();
}

function activateTab(keys, key) {
  keys.forEach((k) => {
    const t = $('#t-' + k), pn = $('#p-' + k), on = k === key;
    t.setAttribute('aria-selected', String(on)); t.tabIndex = on ? 0 : -1; pn.hidden = !on;
  });
  if ($('.graph-canvas')) requestAnimationFrame(wireGraph);
}

/* ---------------- accessibility demo ---------------- */
let TIME = 10, SCENARIO = false;
const G = (() => {
  const nodes = [], edges = [], r = rng(2024), cols = 7, rows = 6, BARRIER_COL = 3;
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
    nodes.push({ x: 0.08 + (i / (cols - 1)) * 0.84 + (r() - 0.5) * 0.035, y: 0.08 + (j / (rows - 1)) * 0.84 + (r() - 0.5) * 0.035 });
  }
  const idx = (i, j) => j * cols + i;
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols - 1; i++) {
    if (i === BARRIER_COL - 1 && j !== 0 && j !== rows - 1) continue;
    edges.push([idx(i, j), idx(i + 1, j)]);
  }
  for (let j = 0; j < rows - 1; j++) for (let i = 0; i < cols; i++) if (r() > 0.14) edges.push([idx(i, j), idx(i, j + 1)]);
  return { nodes, edges, CROSSING: [idx(BARRIER_COL - 1, 3), idx(BARRIER_COL, 3)], origin: idx(BARRIER_COL - 1, 3) };
})();
const SPEED = 4.6, SPAN = 1.5;
const edgeCost = (a, b) => (Math.hypot(G.nodes[a].x - G.nodes[b].x, G.nodes[a].y - G.nodes[b].y) * SPAN / SPEED) * 60;

function solve(withCrossing) {
  const list = withCrossing ? G.edges.concat([G.CROSSING]) : G.edges;
  const adj = G.nodes.map(() => []);
  list.forEach(([a, b]) => { const c = edgeCost(a, b); adj[a].push([b, c]); adj[b].push([a, c]); });
  const dist = G.nodes.map(() => Infinity); dist[G.origin] = 0;
  const seen = new Set();
  while (seen.size < G.nodes.length) {
    let u = -1, best = Infinity;
    for (let i = 0; i < dist.length; i++) if (!seen.has(i) && dist[i] < best) { best = dist[i]; u = i; }
    if (u < 0) break;
    seen.add(u);
    for (const [v, c] of adj[u]) if (dist[u] + c < dist[v]) dist[v] = dist[u] + c;
  }
  return { dist, list };
}
const reachCount = (dist, list, T) => list.filter(([a, b]) => dist[a] <= T && dist[b] <= T).length;

function paintGraph(cv, base, prop) {
  const { ctx, w, h } = fitCanvas(cv);
  ctx.clearRect(0, 0, w, h);
  const P = (n) => [16 + G.nodes[n].x * (w - 32), 16 + G.nodes[n].y * (h - 32)];
  ctx.lineWidth = 1; ctx.strokeStyle = 'rgba(69,96,99,.85)';
  prop.list.forEach(([a, b]) => { const A = P(a), B = P(b); ctx.beginPath(); ctx.moveTo(A[0], A[1]); ctx.lineTo(B[0], B[1]); ctx.stroke(); });
  ctx.lineWidth = 2.1; ctx.strokeStyle = C.network;
  base.list.forEach(([a, b]) => { if (base.dist[a] <= TIME && base.dist[b] <= TIME) { const A = P(a), B = P(b); ctx.beginPath(); ctx.moveTo(A[0], A[1]); ctx.lineTo(B[0], B[1]); ctx.stroke(); } });
  if (SCENARIO) {
    ctx.lineWidth = 2.6; ctx.strokeStyle = C.active;
    prop.list.forEach(([a, b]) => {
      const now = prop.dist[a] <= TIME && prop.dist[b] <= TIME;
      const was = base.dist[a] <= TIME && base.dist[b] <= TIME;
      if (now && !was) { const A = P(a), B = P(b); ctx.beginPath(); ctx.moveTo(A[0], A[1]); ctx.lineTo(B[0], B[1]); ctx.stroke(); }
    });
    const A = P(G.CROSSING[0]), B = P(G.CROSSING[1]);
    ctx.setLineDash([4, 4]); ctx.lineWidth = 2; ctx.strokeStyle = C.form;
    ctx.beginPath(); ctx.moveTo(A[0], A[1]); ctx.lineTo(B[0], B[1]); ctx.stroke(); ctx.setLineDash([]);
  }
  const O = P(G.origin);
  ctx.beginPath(); ctx.arc(O[0], O[1], 5, 0, 7); ctx.fillStyle = C.active; ctx.fill();
  ctx.beginPath(); ctx.arc(O[0], O[1], 11, 0, 7); ctx.strokeStyle = 'rgba(166,248,196,.5)'; ctx.lineWidth = 1; ctx.stroke();
  ctx.font = '9.5px "JetBrains Mono", monospace'; ctx.fillStyle = 'rgba(165,180,177,.9)';
  ctx.fillText('ORIGIN', O[0] + 15, O[1] + 3.5);
}

function drawGraph() {
  const targets = $$('.graph-canvas').filter((c) => c.offsetParent !== null);
  const base = solve(false), prop = solve(SCENARIO);
  targets.forEach((cv) => paintGraph(cv, base, prop));
  const nb = reachCount(base.dist, base.list, TIME), np = reachCount(prop.dist, prop.list, TIME);
  $$('.js-reach').forEach((o) => { o.textContent = `${np} / ${prop.list.length} SCHEMATIC SEGMENTS REACHED`; });
  const html = SCENARIO
    ? `With the crossing, <b>${np}</b> schematic segments are reachable within <b>${TIME} minutes</b>, against <b>${nb}</b> on the baseline. Delta <b>${np - nb}</b> segments. These are counts of drawn segments in a generated graph, not streets, people or places.`
    : `Baseline: <b>${nb}</b> of <b>${base.list.length}</b> schematic segments reachable within <b>${TIME} minutes</b>. Toggle the crossing to compare.`;
  $$('.js-delta').forEach((b) => { b.innerHTML = html; });
}

function syncControls() {
  $$('.timepick .chip').forEach((o) => o.setAttribute('aria-pressed', String(+o.dataset.t === TIME)));
  $$('.scen-toggle').forEach((o) => { o.setAttribute('aria-pressed', String(SCENARIO)); o.textContent = SCENARIO ? 'REMOVE CROSSING' : 'ADD CROSSING'; });
}
function wireGraph() {
  $$('.timepick .chip').forEach((b) => { b.onclick = () => { TIME = +b.dataset.t; syncControls(); drawGraph(); }; });
  $$('.scen-toggle').forEach((b) => { b.onclick = () => { SCENARIO = !SCENARIO; syncControls(); drawGraph(); }; });
  $$('.graph-canvas').forEach((cv) => {
    if (cv.dataset.ro) return;
    cv.dataset.ro = '1';
    new ResizeObserver(() => requestAnimationFrame(drawGraph)).observe(cv);
  });
  syncControls(); drawGraph();
}

/* ---------------- search ---------------- */
(function search() {
  const dlg = $('#cmd'), input = $('#cmdInput'), list = $('#cmdList');
  if (!dlg) return;
  function render(q = '') {
    const s = q.trim().toLowerCase();
    const hits = PROJECTS.filter((p) => !s || (p.question + p.title + p.domain + p.place + p.blurb).toLowerCase().includes(s));
    list.innerHTML = hits.length ? hits.map((p) => `
      <li><button data-id="${p.id}">
        <span><strong style="font-family:var(--mono);font-weight:600">${esc(p.question)}</strong><br>
        <span class="lbl">${p.num} / ${esc(p.domain)} / ${esc(p.place)} / ${esc(p.maturity)}</span></span>
        <span class="lbl" style="color:var(--${p.color})">OPEN</span>
      </button></li>`).join('')
      : '<li><div style="padding:18px 22px;color:var(--text-2);font-size:14px">Nothing matches that. Search covers the listed investigations.</div></li>';
    list.querySelectorAll('button').forEach((b) => b.addEventListener('click', () => { dlg.close(); select(b.dataset.id); }));
  }
  $('#openSearch').addEventListener('click', () => { render(''); dlg.showModal(); input.value = ''; input.focus(); });
  input.addEventListener('input', () => render(input.value));
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); const b = list.querySelector('button'); if (b) b.click(); }
    if (e.key === 'ArrowDown') { e.preventDefault(); const b = list.querySelector('button'); if (b) b.focus(); }
  });
  addEventListener('keydown', (e) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); $('#openSearch').click(); } });
})();

/* ---------------- boot ---------------- */
if ($('#rows')) {
  renderFilters(); renderRows(); renderMarkers(); drawAtlas();
  renderInvestigation(PROJECTS[0]);
  new ResizeObserver(() => requestAnimationFrame(drawAtlas)).observe($('#atlasCanvas'));
  $('#resetAtlas').addEventListener('click', () => { activeFilter = 'ALL'; renderFilters(); renderRows(); renderMarkers(); drawAtlas(); });
  addEventListener('resize', () => { drawAtlas(); drawGraph(); });
}
