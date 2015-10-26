//Calculator
//Copyright (C) 2012 Mathieu Vonlanthen
//Licensed under GPL v3
"use strict";
  var nbOk      = 0;
  var nbFail    = 0;
  var timeoutInit = 50;
  var timeout = timeoutInit;
  var isRunning = false;
  function initOp(){
      var factor;
      if($("#selectDifficulty").val()==="Easy"){factor=10;}
      if($("#selectDifficulty").val()==="Medium"){factor=100;}
      if($("#selectDifficulty").val()==="Difficult"){factor=1000;}
      
      $("#op1").text(Math.round(factor*Math.random()));
      $("#op2").text(Math.round(factor*Math.random()));
      $("#result").val("");
  }
  function initOperator(){
      if($("#selectOp").val()==="*"){
           $("#operator").text("x");
      }else{
          $("#operator").text($("#selectOp").val());
      }
  }
  $( document ).ready(function() {
      initOp();
      initOperator();
      $("#timeout").text(timeout);
      $("input").keypress(enterResult); 
      $("#selectOp").change(function (){initOperator();});
      $("#selectDifficulty").change(function (){initOp();});
      $('#replay').click(replay);
      $('#resetScore').click(function(){
          localStorage.clear();
          showScore();
       });
   
  });
  function enterResult(event){
          if(event.which===13){
             if(!isRunning){
                 isRunning = true;
                 setTimeout(timeOut,1000);
             }     
              if($("#result").val()!=="" && 
                  checkResult($("#op1").text(),$('#op2').text(),
                             $("#selectOp").val(), $("#result").val())){
                  $("#nbOk").text(++nbOk);
                  $("#ok").css("background-color","green");
                  $("#fail").css("background-color","white");
              }else{
                  $("#ok").css("background-color","white");
                  $("#fail").css("background-color","red");
                  $("#nbFail").text(++nbFail);
              }
          initOp();
          }
  }
  function checkResult(op1,op2,operator,result){
     switch(operator){
       //convert to string
       case '+' : return +op1 + +op2 === +result; 
       case '-' : return +op1 - +op2 === +result;
       case '*' : return +op1 * +op2 === +result;
     }
  }
  function replay(){
    $('#divScore').hide();
    $('#wrapper').show();
    $("#nbOk").text(nbOk=0);
    $("#nbFail").text(nbFail=0);
    initOp();
    $("#timeout").text(timeout=timeoutInit);
  }
  function timeOut(){
          timeout--;
          $("#timeout").text(timeout);
          if(timeout===0){
              isRunning=false;
              var nbScore = localStorage.getItem("nbScore");
              if(nbScore===null) nbScore=1;
              else nbScore++;
              localStorage.setItem("nbScore",nbScore);
              localStorage.setItem("score"+(nbScore-1),JSON.stringify({
                 nbOk : nbOk,
                 nbFail : nbFail
              }));
              showScore();
          }else{
              setTimeout(timeOut,1000);
          }
   }
   function showScore() {
     $('#wrapper').hide();
     $('#divScore').show();
     $('#tabScore').html('');
     var nbScore = localStorage.getItem("nbScore");
     for(var i=0;i<nbScore;i++){
       var score = localStorage.getItem("score"+i);
       score = JSON.parse(score);
       var rate  = Math.round(score.nbOk/(score.nbOk+score.nbFail)*100); 
       $('#tabScore').append('<tr><td>'+score.nbOk+'</td><td>'+score.nbFail+'</td><td>'+rate+'%</td></tr>');
     }
   }

