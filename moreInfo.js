var cacheData = {}


function generateActor(ind){

  var template = $("#actor-template").html();
  var comp = Handlebars.compile(template);
  var res = comp(cacheData.cast[ind]);
  return res;
}


function createInfoPage(){

  var fList = $(".filmList")
  var template = $("#InfoPage-template").html();
  var comp = Handlebars.compile(template);
  var res = comp(cacheData);

  var item = $(res);
  var actors = item.find(".cast .actors");
  if(cacheData.cast != ""){

    for (var i = 0; i < cacheData.cast.length; i++) {
      actors.append(generateActor(i));
    }

  }

  item.appendTo(fList)

}


function getCast(id,type){

  var outData = {

    api_key: "be7a5b068bb701d40ef499c039960c53",
    language: "en",
   }

  var url = "https://api.themoviedb.org/3/" + type + "/" + id +"/credits";

  $.ajax({

    url: url,
    method: "GET",
    data: outData,
    success: function(inData, stato){

      var n = 5;
      if(inData.cast.length < 5) n = inData.cast;
      else if (inData.cast.length == 0 ) {
        cacheData.cast = "";
        return;
      }

      cacheData.cast = [];
      for (var i = 0 ; i < n ; i++) {

        var image = "";
        if(inData.cast[i].profile_path != null){
          image = "https://image.tmdb.org/t/p/w154/" + inData.cast[i].profile_path;
        }
        else{
          image = ""
        }
        cacheData.cast.push({
                        personaggio: inData.cast[i].character,
                        attore: inData.cast[i].name,
                        foto: image,
        })
      }


      createInfoPage();

    },
    error: function(request, stato ,error){

      console.log("error");
    }
  })
}


function getImgDesc(id,type){

  var outData = {

    api_key: "be7a5b068bb701d40ef499c039960c53",
    language: "en",
   }

  var url = "https://api.themoviedb.org/3/" + type + "/" + id;

  $.ajax({

    url: url,
    method: "GET",
    data: outData,
    success: function(inData, stato){

      if(inData.poster_path != null){
        cacheData.poster = "https://image.tmdb.org/t/p/w154/" + inData.poster_path;
      }
      else{
        cacheData.poster = ""
      }
      cacheData.overview = inData.overview ;
      cacheData.generi = "";

      for (var i = 0; i < inData.genres.length; i++) {

        cacheData.generi += inData.genres[i].name;
        if (i < (inData.genres.length - 1)) cacheData.generi += ", "
      }
      getCast(id,type)

    },
    error: function(request, stato ,error){

      console.log("error");
    }
  })

}


function getData(){


  $(".filmList").on("click",".item",function(event){

    if( $(event.target).is(".more") ){

      var info = $(this).find(".info");
      cacheData.id = $(this).attr("data-id");
      cacheData.type = $(this).attr("data-type");
      cacheData.title = info.find(".title .sp").html();
      cacheData.language = info.find(".language .sp").html();
      cacheData.stelle = info.find(".stars .sp").html();
      getImgDesc(cacheData.id,cacheData.type)
    }
  })
}

function closeWindow(){

  $(".filmList").on("click",".wrapper",function(event){

    if($(event.target).is("#goBack") ){

      $(this).fadeOut(300,function(){

        $(this).remove();
        event.stopPropagation();
      })
    }
  })
}

function init2(){

  getData();
  closeWindow();

}
$(document).ready(init2)
