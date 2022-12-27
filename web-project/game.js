let ctx, w, h;
let rightPressed,leftPressed;
let cannon, randColor;
let ballSpeed = 15;
let balls=[];
let targetColor=["#ff0000","#00ff00","#0000ff"], targetss=[], pieceNumPerRow = 7, row = 7;
let ctx2, deg=Math.PI*2/120, count = 0, coolDown;      //  想法：count*deg當count越大就越接近2PI

function start(){
    AJAX();
    $("#button").hide();
    $("#cat").hide();
    // 取得遊戲畫面的canvas元素和繪製權限
    let canvas = document.querySelector("#cont");
    ctx = canvas.getContext('2d');  
    // 取得畫布寬高。
    w = canvas.width;
    h = canvas.height;
    coolDown = false;
    // 初始化一個大砲，每0.5秒變色
    cannon = new Cannon();
    setInterval(function(){
        randColor = rc();
        showTargets();
        cannon.show();
    },500);
    // 取得計時器的canvas元素和繪製權限
    let canvas2 = document.querySelector("#timer");
    ctx2 = canvas2.getContext('2d');
    // 初始化磚塊
    initTarget();
    document.addEventListener("keydown",keydownHandler,false);
}
window.addEventListener("load",start,false);
/***
 * 左右鍵控制大砲底座的水平移動
 * 上下鍵控制大砲砲冠的順逆時鐘旋轉
 * 空白鍵發射小球
 */
function keydownHandler(e){
    if(e.key == "Right" || e.key == "ArrowRight") cannon.move(1)   , showTargets(); 
    if(e.key == "Left"  || e.key == "ArrowLeft" ) cannon.move(-1)  , showTargets();
    if(e.key == "Up"    || e.key == "ArrowUp"   ) cannon.rotate(1) , showTargets();
    if(e.key == "Down"  || e.key == "ArrowDown" ) cannon.rotate(-1), showTargets();
    // 空白鍵發射小球前，檢查技能冷卻狀態。
    if(e.key == " " && !coolDown) {
        // 發射成功設置冷卻狀態
        setCool();
        // 每創建一個小球後，存進陣列以保存當前畫面上所有的小球。
        let ball = new Ball();
        balls.push(ball);
        // 每隔一段時間更新一次畫面，一旦小球掉出地板，從陣列刪除。
        let timer = setInterval(function(){     
            console.log(ball.color);
            if(ball.y>=h+1) {
                balls.shift();
                showBalls();
                clearInterval(timer);
            }
            ball.check();// 對每一顆球，確認是否有打到某一個磚塊
            show(ball);
        },20)
    }
}


/***
 * 物件名稱：磚塊
 * @attr w        磚塊的寬度
 * @attr h        磚塊的高度
 * @attr color    磚塊的顏色
 * @attr hitState 磚塊的狀態
 */
function Target(color){
    this.w = w / pieceNumPerRow;
    this.h = 30;
    this.color = color;
    this.hitState = false;
}



// 顯示所有沒被打破的磚塊
function showTargets(){
    for(let j = 0; j < row; j++){
        for(let i = 0; i < pieceNumPerRow; i++) {
            if(!targetss[j][i].hitState)
                targetss[j][i].show();
        }
    }
}


// 磚塊繪製1
Target.prototype.show = function(){
    this.draw('black', 0);
    this.draw(this.color, 5);
}
// 磚塊繪製2（二次封裝）
Target.prototype.draw = function(color,b){
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.fillRect(this.x+b,this.y+b,this.w-b*2,this.h-b*2);
    ctx.lineWidth = 2;
    ctx.fill();
    ctx.stroke();
}




// 初始化磚塊
function initTarget(){
    for(let j = 0; j < row; j++){
        let targets=[];
        for(let i = 0; i < pieceNumPerRow; i++) {
            // 每創建一個磚塊後，存進陣列以保存當前畫面上所有的磚塊。
            let target = new Target(targetColor[(j*pieceNumPerRow+i)%targetColor.length]);
            target["x"] = i * target.w;
            target["y"] = h / 5 + j * target.h;
            targets.push(target);
        }
        targetss.push(targets);
    }
}


// 在那之前，為磚塊附加位置屬性。

// 判定一顆球是否有打到磚塊
Ball.prototype.check = function(){
    // 三角函數計算，在下一個時刻，小球邊緣的位置
    let nextx = this.x+this.xSpeed;
    let nexty = this.y+this.ySpeed;
    // 打到磚塊還有分從哪個角度打到，所以看球行進時速度的方向
    for(let j = 0; j < row; j++){
        for(let i = 0; i < pieceNumPerRow; i++) {
            let x = targetss[j][i].x, tw = targetss[j][i].w;
            let y = targetss[j][i].y, th = targetss[j][i].h; 
            // 判定小球有沒有碰到磚塊，判定條件為，在下一個時刻，小球邊緣的位置有沒有在磚塊裡面
            if((nextx>=x&&nextx<=x+tw)
             &&(nexty>=y&&nexty<=y+th)
             && !targetss[j][i].hitState){
                // 打到磚塊，小球反彈
                if(this.x<x||this.x>x+tw) this.xSpeed = -this.xSpeed;
                if(this.y<y||this.y>y+th) this.ySpeed = -this.ySpeed;
                // 改變磚塊的狀態
                targetss[j][i].hitState=true;
                // 每次有磚塊被打碎，檢查遊戲是否結束，結束條件是所有的磚塊都被打碎
                if(Win()){
                    console.log('w');
                    showBalls();
                    ctx.font = "30px Arial";
                    ctx.fillText("Hello World",10,50);
                    $("#button").show();
                    $("#cat").show(1000);
                }
                return; } } } }


// let rsin = this.r * Math.sin(cannon.angle);// angle in [5pi/8 11pi/8] sin在pi/2和3pi/2 1是+的往左轉
// let rcos = this.r * Math.cos(cannon.angle);// angle in [5pi/8 11pi/8] cos在pi/2和3pi/2 1是+的往左轉

// if(this.x+this.xSpeed>=x||this.x+this.xSpeed<=x+tw) this.xSpeed = -this.xSpeed;
// if(this.y+this.ySpeed>=y||this.y+this.ySpeed<=y+th) this.ySpeed = -this.ySpeed;
// this.xSpeed = -this.xSpeed;
// this.ySpeed = -this.ySpeed;
// if(this.x+rsin>=x&&this.x+rsin<=x+tw) this.xSpeed = -this.xSpeed;
// if(this.y+rcos>=y&&this.y+rcos<=y+th) this.ySpeed = -this.ySpeed;


// 是否所有的磚塊都被打碎
function Win(){
    for(let j = 0; j < row; j++){
        for(let i = 0; i < pieceNumPerRow; i++) {
            if(!targetss[i][j].hitState) return false;
        }
    }
    return true;
}
// 三次封裝
function show(ball){
    ctx.clearRect(0,0,w,h);
    // showBalls();
    ball.show();
    showTargets();
    cannon.show(); 
}
// 冷卻計時器
let coolDownTimer = setInterval(function(){
    if(coolDown){
        count ++;
        coolDown = true;
        ctx2.beginPath();
        ctx2.arc(50,50,40,-Math.PI/2,count*deg-Math.PI/2,false);
        ctx2.lineWidth = 5;
        ctx2.strokeStyle = 'blanchedalmond';
        ctx2.stroke();
    }
    if(count*deg==2*Math.PI){
        coolDown = false;
        clearInterval(timer);
    }
},1);


function setCool(){
    coolDown = true;
    count = 0;
    ctx2.clearRect(0,0,100,100);
    ctx2.beginPath();
    ctx2.arc(50,50,40,-Math.PI/2,Math.PI*2-Math.PI/2,false);
    ctx2.lineWidth = 5;
    ctx2.strokeStyle = '#f00';
    ctx2.stroke();
}

function reset(){
    for(let j = 0; j < row; j++){
        for(let i = 0; i < pieceNumPerRow; i++) {
            targetss[i][j].hitState = false;
        }
    }
    ctx.clearRect(0,0,w,h);
    start();
}
/*
let limit = (targetss[0][0].w) * (targetss[0][0].w) / 4
          + (targetss[0][0].h) * (targetss[0][0].h) / 4;

    let centerx = targetss[j][i].x + targetss[j][i].w / 2;
    let centery = targetss[j][i].y + targetss[j][i].h / 2;
    let distance = (centerx - this.x) * (centerx - this.x)
    + (centery - this.y) * (centery - this.y);
*/
function AJAX(){
    $.ajax({
        type: "GET",
        url: "https://raw.githubusercontent.com/Yoyorz/ntou-cse/main/web-json.json",
        dataType: "json",
        success: function(game){
            $("#author1").html(game.author1);
            $("#author2").html(game.author2);
            $("#op1").html(game.op1);
            $("#op2").html(game.op2);
            $("#op3").html(game.op3);
        }
    });
}