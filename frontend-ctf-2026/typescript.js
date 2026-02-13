import { Project, SyntaxKind } from "ts-morph";

const TS_CODE = `
type Split<
  T extends string,
  Sep extends string,
  Buff extends string = never,
> = T extends \`\${infer Start}\${Sep}\${infer Rest}\`
  ? Split<Rest, Sep, Buff | Start>
  : Buff | T;

type STR =
  'w?K-X}-V:Q-EB%(-Dy!U-af#-uNW2-6{o-J:V-WoI-uh-28-?*g-o2f-+F-n#+c-J)t}-^HDl-@x*-_t-Dy!U-V:Q-Z?C-}^PM-WonC-_k-h=r%-n#+c-$BX-W.-lKnm-]6-WoI-!sO-HbGQ-+F-}-&ie?-fP-HbGQ-$BX-lKnm-WonC-JAH-WXQ$-Rk-]6-G|?-1GVV-eC-vI1-*J^-zE{-xv_-}^PM-td91-_;er-Z?C-0s-h=r%-+{H8-ta-xEp-^n8-M*-V3|7-JAH-zE{-[kG9-WX-Mk@m-f6iG-Y;;-0s-_%Wh-Rk-p0Pr-xv_-fP-=<9-es_-V3|7-fJ-WX-lxX-xEp-hs-T=d;-^n8-36-Y;;-L%{d-W#7d-GP9z-dC,-Mk@m-*hF-t$vC-7(-ion-*hF-dC,-tu2T-md-L%{d-]I-M&OA-7(-Pt,7-fJ-p2w-q?-IUcX-*3L#-_!>-_r-q?-IUcX-Z]nV-Xjr-XT-Q:]@-y%-M&OA-<N-*3L#-9h;-+_-=me-p2w-_!>-Zt-<C1z-e1kN->TG-sv-]ps4-Z0-?Gw-+_-y%-Q:]@-h*y-FWNg-qx[p-VRg-Ed_E-;O->TG-o%2-9h;-_l-?Gw-8m}2-}vW.-Qv-aPK-a[-c$om-{QMc-h*y-;O-=:If-o%2-rs-8m}2-Z5!]-%s-j:-=:If-c$om-c(VT-H6-pR-@=U9-yH$F-}vW.-CGRA-W*-fQ-aPK-+|-Qv-ecu-4e-H6-,PM&-=_bt-%s-j:-@=U9-gt-;;7-S=-p>H-qxs-7<$-yp-<$28-HGE-17v-4e-kw-js-p>H-y^#-=_bt-Qx+-^8-S=-vF-LB-%u-,PM&-f07-#B-h}P-1+EF-kw->V-:Qg0-yr#-o#-h!Q&-js-D6-vF-y^#-17v-<$28-e5+}-zx>I-9W-aZ^-euH-%u-^8-OgW$-_*-HGE-c(n?-9VWh-ag-5j5g-OG}5-o]-1+EF-yr#-L8-ba-2J-e5+}-_*-JNP<-zVL-[C4-:]-:Qg0-{fl-vLB-O0=|-!H2>-.}(-2J-v;-j5t-+lv-[C4-Ulcy-2:-o]-e@a-JNP<-zVL-ry-Te-FC3-Lk|F-OG}5-5j5g-il-a1-*C7-G;-!OMY-HM-#Ye-da-Z2Hz-Hmw-w#&-)Jv>-H6-#h-46xV-[Wza-CD-t.P-PLuW-%)6-[(Xb-';
type Result = Split<STR, '-'>;
`;

const INDEXES = [
    185,
    174,
    20,
    143,
    62,
    49,
    200,
    86,
    133,
    120,
    75,
    111,
    100,
    155,
    32,
];

const project = new Project({useInMemoryFileSystem: true});
const sourceFile = project.createSourceFile("code.ts", TS_CODE);
const type = sourceFile.getLastChildByKind(SyntaxKind.TypeAliasDeclaration);
const props = type
    .getType()
    .getUnionTypes()
    .map((t) => t.getText().slice(1, -1));

console.log(INDEXES.map(i => props[i]).join(''))
