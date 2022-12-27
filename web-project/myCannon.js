/***
 * 物件名稱：小球
 * @param size 小球大小
 * @attr x 小球圓心x座標
 * @attr y 小球圓心y座標
 * @attr r 小球半徑
 * @attr color 小球顏色：由隨機方式產生
 * @attr xSpeed 小球水平方向速度
 * @attr ySpeed 小球鉛直方向速度
 */
function Ball(size=10){
    this.x = cannon.x;
    this.y = cannon.y;
    this.r = size;
    this.color = 'yellow';
    this.xSpeed =  ballSpeed * Math.sin(cannon.angle);
    this.ySpeed =  ballSpeed * Math.cos(cannon.angle);
}


// angle in [5pi/8 11pi/8]
// angle in [5pi/8 11pi/8]
//'#'+parseInt(Math.random()*0xffffff).toString(16);

// 畫出實心小球
Ball.prototype.show = function(){
    this.run();
    ctx.beginPath();
    ctx.arc(this.x,this.y,this.r,0,Math.PI*2);
    ctx.fillStyle = this.color;
    ctx.fill();
}

// 碰撞檢測：碰到canvas邊界就反彈
Ball.prototype.run = function(){
    if(this.x-this.r<=0 || this.x+this.r>=w) this.xSpeed = -this.xSpeed; this.x += this.xSpeed;
    if(this.y-this.r<=0)                     this.ySpeed = -this.ySpeed; this.y += this.ySpeed;
}


/***
 * 物件名稱：大砲
 * @param size 小球大小
 * @attr x 大砲底座中心x座標
 * @attr y 大砲底座中心y座標
 * @attr r 大砲底座半徑
 * @attr speed 大砲底座移動速度
 * @attr len   大砲砲管長度
 * @attr angle 大砲砲管當前瞄準的方向
 * @attr angleSpeed 大砲砲管旋轉的角速度
 */
function Cannon(){
    this.x=w/2;
    this.y=h;
    this.r=50;
    this.speed=20;
    this.angleSpeed=Math.PI*2/60;
    this.len=65;
    this.angle=Math.PI;
}

// 大砲底座顯示1
Cannon.prototype.show = function(){
    // 分層次繪製大砲
    this.drawBase(0,"black");
    this.drawBase(-5,randColor);
    this.drawBase(-10,"black");
    this.drawBase(-20,randColor);
    this.drawBase(-25,"black");
    // 砲管繪製
    ctx.beginPath();
    ctx.moveTo(this.x,this.y);
    ctx.lineTo(this.x+this.len*Math.sin(this.angle)
               ,this.y+this.len*Math.cos(this.angle));
    ctx.lineWidth = 25;
    ctx.stroke();
}


// 大砲移動
Cannon.prototype.move = function(dir){
    if(this.x+this.r+this.speed*dir>=w 
    || this.x-this.r+this.speed*dir<=0) return;
    this.x+=dir*this.speed;
    ctx.clearRect(0,0,w,h);
    this.show();
}


// 大砲砲管旋轉
Cannon.prototype.rotate = function(dir){
    if(this.angle+this.angleSpeed*dir>=11*Math.PI/8 
    || this.angle+this.angleSpeed*dir<=5 *Math.PI/8) return;
    this.angle+=dir*this.angleSpeed;
    ctx.clearRect(0,0,w,h);
    this.show();
}



// 大砲底座顯示2（二次封裝）
Cannon.prototype.drawBase = function(rr,color){         
    ctx.beginPath();
    ctx.arc(this.x,this.y,this.r+rr,0,Math.PI,true);
    ctx.lineWidth = 2;
    ctx.fillStyle = color;
    ctx.fill();
    ctx.stroke();
}

// 箭頭函數二次封裝會有問題
// 顯示所有的小球
function showBalls(){
    for(var i = 0; i < balls.length; ++i) balls[i].show();
}
// 隨機顏色
function rc(){
    return '#'+parseInt(Math.random()*0xffffff).toString(16);
}
// 隨機整數
function ri(num){
    return Math.random()*num;
}
// 拖延器
function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}
// 以下為沒有二次封裝需要寫的程式碼
// ctx.beginPath();
// ctx.arc(this.x,this.y,this.r,0,Math.PI,true);
// ctx.lineWidth = 2;
// ctx.fillStyle = "black";
// ctx.fill();
// ctx.stroke();

// ctx.beginPath();
// ctx.arc(this.x,this.y,this.r-5,0,Math.PI,true);
// ctx.lineWidth = 2;
// ctx.fillStyle = "yellow";
// ctx.fill();
// ctx.stroke();

// ctx.beginPath();
// ctx.arc(this.x,this.y,this.r-10,0,Math.PI,true);
// ctx.lineWidth = 2;
// ctx.fillStyle = "black";
// ctx.fill();
// ctx.stroke();
