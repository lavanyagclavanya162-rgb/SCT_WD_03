let board = ["","","","","","","","",""];
let currentPlayer = "X";
let gameActive = true;
let xScore = 0;
let oScore = 0;

const winPatterns = [
[0,1,2],[3,4,5],[6,7,8],
[0,3,6],[1,4,7],[2,5,8],
[0,4,8],[2,4,6]
];

const boardDiv = document.getElementById("board");

function createBoard(){
boardDiv.innerHTML="";
board.forEach((cell,i)=>{
let div=document.createElement("div");
div.classList.add("cell");
div.dataset.index=i;
div.innerText=cell;
div.addEventListener("click",cellClick);
boardDiv.appendChild(div);
});
}

function cellClick(e){
let i=e.target.dataset.index;
if(board[i]!==""||!gameActive)return;

board[i]=currentPlayer;
createBoard();
checkWinner();

if(document.getElementById("mode").value==="cpu" && currentPlayer==="O"){
setTimeout(cpuMove,500);
}
}

function cpuMove(){
let diff=document.getElementById("difficulty").value;
let move;

if(diff==="easy") move=randomMove();
else if(diff==="medium") move=smartMove();
else move=minimax(board,"O").index;

board[move]="O";
createBoard();
checkWinner();
}

function randomMove(){
let empty=board.map((v,i)=>v===""?i:null).filter(v=>v!==null);
return empty[Math.floor(Math.random()*empty.length)];
}

function smartMove(){
for(let p of winPatterns){
let [a,b,c]=p;
if(board[a]==="O"&&board[b]==="O"&&board[c]==="") return c;
if(board[a]==="O"&&board[c]==="O"&&board[b]==="") return b;
if(board[b]==="O"&&board[c]==="O"&&board[a]==="") return a;
}
return randomMove();
}

function minimax(newBoard,player){
let empty=newBoard.map((v,i)=>v===""?i:null).filter(v=>v!==null);

if(checkWin(newBoard,"X")) return {score:-10};
if(checkWin(newBoard,"O")) return {score:10};
if(empty.length===0) return {score:0};

let moves=[];
for(let i of empty){
let move={};
move.index=i;
newBoard[i]=player;

let result=minimax(newBoard,player==="O"?"X":"O");
move.score=result.score;

newBoard[i]="";
moves.push(move);
}

return player==="O"
?moves.reduce((a,b)=>a.score>b.score?a:b)
:moves.reduce((a,b)=>a.score<b.score?a:b);
}

function checkWinner(){
if(checkWin(board,currentPlayer)){
document.getElementById("status").innerText=currentPlayer+" Wins!";
gameActive=false;

if(currentPlayer==="X"){
xScore++;
document.getElementById("xscore").innerText=xScore;
}
else{
oScore++;
document.getElementById("oscore").innerText=oScore;
}
return;
}

if(!board.includes("")){
document.getElementById("status").innerText="Draw!";
gameActive=false;
return;
}

currentPlayer=currentPlayer==="X"?"O":"X";
document.getElementById("status").innerText="Player "+currentPlayer+"'s Turn";
}

function checkWin(b,p){
return winPatterns.some(pat=>{
return pat.every(i=>b[i]===p);
});
}

function restartGame(){
board=["","","","","","","","",""];
gameActive=true;
currentPlayer="X";
document.getElementById("status").innerText="Player X's Turn";
createBoard();
}

createBoard();
