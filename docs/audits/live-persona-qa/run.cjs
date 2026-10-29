const {chromium}=require('playwright');
const fs=require('fs'),path=require('path');
const base=process.env.QA_BASE||'https://www.weartimeless.xyz';
const phase=process.env.QA_PHASE||'before';
const root=path.resolve(__dirname,phase);
const personas=(process.env.QA_PERSONAS||'impatient,skeptic,mobile,literal,breaker').split(',');
(async()=>{const browser=await chromium.launch({headless:true});const all=[];
for(const name of personas){
const mobile=['mobile','literal'].includes(name);const context=await browser.newContext({viewport:mobile?{width:375,height:812}:{width:1440,height:900},isMobile:mobile,hasTouch:mobile,locale:name==='literal'?'fr-NG':'en-NG'});
await context.route(/google-analytics\.com|googletagmanager\.com/,r=>r.abort());
const page=await context.newPage();page.setDefaultTimeout(12000);page.setDefaultNavigationTimeout(90000);const dir=path.join(root,name);fs.mkdirSync(dir,{recursive:true});const report={persona:name,base,phase,viewport:mobile?375:1440,issues:[],steps:[],errors:[],screenshots:[],newsletterSafeProbe:null};
page.on('pageerror',e=>report.errors.push(e.message));
let shotCount=0;
async function shot(label){const file=String(++shotCount).padStart(2,'0')+'-'+label+'.png';await page.screenshot({path:path.join(dir,file),animations:'disabled'});report.screenshots.push(file);}
function issue(id,detail){if(!report.issues.some(i=>i.id===id))report.issues.push({id,detail});}
async function consentCheck(){const prompt=page.getByRole('complementary',{name:'Optional measurement'});if(await prompt.count()){
const overlap=await page.evaluate(()=>{const a=document.querySelector('aside[aria-label="Optional measurement"]');const links=[...document.querySelectorAll('a')];const c=links.find(x=>/Explore the first drop/i.test(x.textContent));if(!a||!c)return null;const x=a.getBoundingClientRect(),y=c.getBoundingClientRect();return{overlap:x.left<y.right&&x.right>y.left&&x.top<y.bottom&&x.bottom>y.top,promptHeight:x.height,viewport:innerHeight};});
if(overlap?.overlap){issue('CONSENT-COVERS-CTA',overlap);await shot('consent-covers-cta');}
await prompt.getByRole('button',{name:'Decline',exact:true}).click();report.steps.push('Declined optional measurement');}}
try{
if(name==='mobile'){const cdp=await context.newCDPSession(page);await cdp.send('Network.enable');await cdp.send('Network.emulateNetworkConditions',{offline:false,latency:400,downloadThroughput:500000/8,uploadThroughput:500000/8});await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});report.throttle={latencyMs:400,downloadKbps:500,uploadKbps:500,cpuSlowdown:4};}
const start=Date.now();await page.goto(base,{waitUntil:'load',timeout:90000});report.domContentLoadedMs=Date.now()-start;
await page.getByRole('link',{name:/Explore the first drop/i}).waitFor();await page.waitForTimeout(name==='mobile'?5000:1800);await shot('landing');await consentCheck();await page.waitForTimeout(500);
if(name==='skeptic'){
for(const route of ['shipping','returns','privacy','terms']){const policyLink=page.getByRole('contentinfo').getByRole('link',{name:new RegExp('^'+route+'$','i')}).last();await policyLink.scrollIntoViewIfNeeded();await page.waitForTimeout(800);await policyLink.click();await page.waitForURL('**/'+route);await page.getByRole('heading',{level:1}).waitFor();report.steps.push('Read '+route);await shot(route);}
await page.goto(base,{waitUntil:'load'});
}
if(['skeptic','literal','breaker'].includes(name)){
const form=page.locator('form').first();await form.scrollIntoViewIfNeeded();await form.locator('input[type=email]').fill(name==='breaker'?'not-an-email':'launch-qa@example.invalid');
if(name==='breaker'){await form.getByRole('button').click();report.invalidEmailBlocked=await form.locator('input[type=email]').evaluate(e=>!e.validity.valid);await shot('invalid-email');await form.locator('input[type=email]').fill('launch-qa@example.invalid');}
await form.locator('input[name=consent]').check();
// Browser intercept guarantees no provider write. Reproduce origin/config checks using an INVALID request first.
if(new URL(base).hostname==='127.0.0.1'){const r=await context.request.post(base+'/api/newsletter',{headers:{Origin:'https://www.weartimeless.xyz'},data:{email:'invalid',consent:false}});report.newsletterSafeProbe={status:r.status(),body:await r.json(),note:'Loopback server probe uses configured production origin; UI submissions are mocked'};}else{report.newsletterSafeProbe=await page.evaluate(async()=>{const r=await fetch('/api/newsletter',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:'invalid',consent:false})});return{status:r.status,body:await r.json()}});}
if(report.newsletterSafeProbe.status===403){issue('NEWSLETTER-ORIGIN','Live same-origin signup is rejected before validation');await page.route('**/api/newsletter',r=>r.fulfill({status:403,contentType:'application/json',body:JSON.stringify(report.newsletterSafeProbe.body)}));}
else{if(report.newsletterSafeProbe.status===503&&new URL(base).hostname!=='127.0.0.1')issue('NEWSLETTER-CONFIGURATION','Live Brevo configuration missing or invalid');await page.route('**/api/newsletter',r=>r.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true,message:'Please check your email and confirm your subscription.'})}));report.newsletterSuccessMocked=true;report.realEmailDeliveryVerified=false;}
await form.getByRole('button').click();await page.waitForTimeout(250);await shot('newsletter-result');report.newsletterUI=await page.locator('[role=alert],[role=status]').allTextContents();
await page.unroute('**/api/newsletter');
if(name==='literal'&&report.newsletterSafeProbe.status===403)report.literalConfusion='The UI says use the Timeless website while I am already on it';
}
await page.goto(base,{waitUntil:'load'});await page.getByRole('link',{name:/Explore the first drop/i}).click();await page.locator('main a[href^="/shop/"]').first().click();await page.waitForURL('**/shop/essential-tee');await page.waitForLoadState('load');await page.waitForFunction(()=>{const b=document.querySelector('.product-size-selector button');return b && Object.keys(b).some(k=>k.startsWith('__reactProps')&&typeof b[k].onClick==='function')});await shot('product');
const primary=page.locator('.product-size-selector').first();await primary.getByRole('button',{name:'M',exact:true}).click();
const add=page.getByRole('button',{name:'Add to Bag',exact:true}).first();await add.click();await page.getByRole('dialog',{name:'Your bag'}).waitFor();await shot('bag');
report.bagText=await page.getByRole('dialog',{name:'Your bag'}).innerText();const checkout=page.getByRole('link',{name:'Continue checkout on WhatsApp'});
if(await checkout.count()){const href=await checkout.getAttribute('href');const url=new URL(href);report.firstSuccess={type:'order_request_prepared',host:url.hostname,messageHasSize:url.searchParams.get('text')?.includes('M'),messageHasShipping:/shipping/i.test(url.searchParams.get('text')||''),openedExternal:false};}else{issue('CHECKOUT-UNAVAILABLE','No WhatsApp handoff configured');report.firstSuccess=false;}
if(name==='breaker'){
await page.getByRole('button',{name:'Close bag'}).click();await page.goBack({waitUntil:'load'});await page.goForward({waitUntil:'load'});await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));await page.waitForTimeout(800);await page.getByRole('button',{name:/Open shopping bag with/}).first().click();await shot('history-bag');report.bagSurvivesHistory=await page.getByRole('dialog',{name:'Your bag'}).isVisible();
await page.getByRole('button',{name:'Close bag'}).click();await page.locator('.product-size-selector').first().getByRole('button',{name:'M',exact:true}).click();
// Real double-click; dialog can intercept second pointer event.
try{await page.getByRole('button',{name:'Add to Bag',exact:true}).first().dblclick({timeout:2000});}catch(e){report.doubleClickInterception=e.message.split('\n')[0];}
report.doubleClickBagOpen=await page.getByRole('dialog',{name:'Your bag'}).isVisible();if(!report.doubleClickBagOpen){issue('DOUBLE-CLICK-DISMISSES-BAG','Second click on Add dismisses the new bag drawer');await shot('double-click-dismissed-bag');}else{report.doubleClickBagText=await page.getByRole('dialog',{name:'Your bag'}).innerText();await shot('double-click-bag');}
}
report.overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
report.steps.push('Prepared WhatsApp request without opening or sending it');
}catch(e){report.stuck=e.message;issue('FLOW-INTERRUPTED',e.message.split('\n')[0]);await shot('stuck').catch(()=>{});}
fs.writeFileSync(path.join(dir,'report.json'),JSON.stringify(report,null,2));all.push(report);console.log(name,JSON.stringify({issues:report.issues,firstSuccess:report.firstSuccess,stuck:report.stuck?.slice(0,120),dcl:report.domContentLoadedMs}));await context.close();
}
fs.mkdirSync(root,{recursive:true});fs.writeFileSync(path.join(root,'results.json'),JSON.stringify(all,null,2));await browser.close();})().catch(e=>{console.error(e);process.exit(1)});
