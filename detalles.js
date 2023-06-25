$(document).ready(function() {
  // Obtener el ID de la serie desde la URL
  var serieId = obtenerParametroURL("id");

  // Lógica para obtener los detalles de la serie seleccionada
  var apiKey = "9d23dd20";
  var serieUrl = "https://www.omdbapi.com/?apikey=" + apiKey + "&i=" + serieId;

  $.ajax({
    url: serieUrl,
    type: "GET",
    dataType: "json",
    success: function(response) {
      if (response.Response === "True") {
        var serie = response;

        // Construir el HTML con los detalles de la serie
        var output = `
        <a href="index.html" class="titulo">${serie.Title}</a>
          <div class="detalle-serie degradado">

            <div class="poster-container degradado">
              <img src="${serie.Poster}" class="poster">
              </div>
              <div>
              <button id="btn-favorito" class="favorito-btn" data-serie-id="${serieId}"><i class="fas fa-heart"></i></button>
              <div id="favoritos-logo">
              <div id="favoritos-texto" class="favs"></div>
                </div>

            </div>
            <div class="detalle-info degradado">
              <p>${serie.Plot}</p>
              <div id="temporadas-container"></div>
              <p>Género: ${serie.Genre}</p>
              <p>Año: ${serie.Year}</p>
              <p>Actores: ${serie.Actors}</p>
              <p>Director: ${serie.Director}</p>
              <p>Escritor: ${serie.Writer}</p>
              <p>Productor: ${serie.Production}</p>
              <p>País: ${serie.Country}</p>
              <p>Idioma: ${serie.Language}</p>
              <p>Fecha de estreno: ${serie.Released}</p>
              <p>Rating: ${serie.imdbRating}</p>
              <p>Votos: ${serie.imdbVotes}</p>
            </div>
          </div>
        `;

        // Insertar el HTML generado en el elemento con el id "detalle-serie"
        $("#detalle-serie").html(output);

        // Obtener la información de cada temporada
        obtenerDetallesTemporadas(serieId, function(temporadas) {
          if (temporadas) {
            // Ordenar las temporadas por número
            ordenarTemporadas(temporadas);

            // Generar dinámicamente el contenido de cada temporada
            for (var i = 0; i < temporadas.length; i++) {
              var temporada = temporadas[i];
              var temporadaOutput = `
                <div class="temporada" id="temporada-${temporada.season}" data-temporada="${temporada.season}">
                  <h3>Temporada ${temporada.season}</h3>
                  <div class="temporada-contenido">
              `;
              console.log(temporadaOutput);

              // Generar el contenido de cada episodio de la temporada
              for (var j = 0; j < temporada.Episodes.length; j++) {
                var episode = temporada.Episodes[j];
                temporadaOutput += `
                  <div class="episode">
                    <h4>Episodio ${j + 1}</h4>
                    <p>${episode.Title}</p>
                  </div>
                `;
              }

              temporadaOutput += `</div></div>`;

              // Insertar el contenido de la temporada en el contenedor correspondiente
              $("#temporadas-container").append(temporadaOutput);
            }

            // Ocultar/mostrar el contenido de cada temporada al hacer clic en el encabezado
            $(".temporada").on("click", "h3", function() {
              $(this).siblings(".temporada-contenido").slideToggle();
            });
          } else {
            $("#temporadas-container").html("<p>No se encontró información de las temporadas</p>");
          }
        });

        // Manejar el evento de clic en el botón de favoritos
        $(document).on("click", "#btn-favorito", function() {
          var serieId = $(this).data("serie-id");
          agregarFavorito(serieId);
        });
      } else {
        $("#detalle-serie").html("<p>No se encontró información de la serie</p>");
      }
    },
    error: function() {
      $("#detalle-serie").html("<p>Error al obtener los detalles de la serie</p>");
    }
  });

  function obtenerDetallesTemporadas(serieId, callback) {
    var temporadaUrl = "https://www.omdbapi.com/?apikey=" + apiKey + "&i=" + serieId + "&Season=1";

    $.ajax({
      url: temporadaUrl,
      type: "GET",
      dataType: "json",
      success: function(response) {
        if (response.Response === "True" && response.totalSeasons) {
          var totalSeasons = parseInt(response.totalSeasons);
          var temporadas = [];

          // Obtener los detalles de cada temporada
          for (var i = 1; i <= totalSeasons; i++) {
            obtenerDescripcionTemporada(serieId, i, function(temporada, temporadaNumero) {
              if (temporada) {
                temporadas.push({
                  season: temporadaNumero,
                  Plot: temporada.Plot,
                  Episodes: temporada.Episodes
                });
              }

              // Llamar al callback cuando se hayan obtenido los detalles de todas las temporadas
              if (temporadas.length === totalSeasons) {
                callback(temporadas);
              }
            });
          }
        } else {
          callback(null);
        }
      },
      error: function() {
        callback(null);
      }
    });
  }

  function obtenerDescripcionTemporada(serieId, temporadaNumero, callback) {
    var temporadaUrl = "https://www.omdbapi.com/?apikey=" + apiKey + "&i=" + serieId + "&Season=" + temporadaNumero;

    $.ajax({
      url: temporadaUrl,
      type: "GET",
      dataType: "json",
      success: function(response) {
        if (response.Response === "True") {
          callback(response, temporadaNumero);
        } else {
          callback(null, temporadaNumero);
        }
      },
      error: function() {
        callback(null, temporadaNumero);
      }
    });
  }

  function ordenarTemporadas(temporadas) {
    temporadas.sort(function(a, b) {
      return a.season - b.season;
    });
  }

  // Función para agregar una serie a la lista de favoritos
  function agregarFavorito(serieId) {
    const favoritos = obtenerFavoritos();
    
    if (favoritos.includes(serieId)) {
      // El serieId ya está en la lista de favoritos, quitarlo
      const index = favoritos.indexOf(serieId);
      favoritos.splice(index, 1);
      localStorage.setItem("favoritos", JSON.stringify(favoritos));

      $("#favoritos-texto").text("Serie eliminada de favoritos");
      $("#favoritos-texto").show();
  
      setTimeout(function() {
        $("#favoritos-texto").hide();
      }, 3000); // Ocultar después de 3 segundos (3000 milisegundos)
      

    } else {
      // El serieId no está en la lista de favoritos, agregarlo
      favoritos.push(serieId);
      localStorage.setItem("favoritos", JSON.stringify(favoritos));
      
      $("#favoritos-texto").text("Serie agregada de favoritos");
      $("#favoritos-texto").show();
  
      setTimeout(function() {
        $("#favoritos-texto").hide();
      }, 3000); // Ocultar después de 3 segundos (3000 milisegundos)
      
    }
  }
  
  
  
  // Función para obtener la lista de favoritos desde localStorage
  function obtenerFavoritos() {
    const favoritos = localStorage.getItem("favoritos");
  
    if (!favoritos) {
      return [];
    }
  
    return JSON.parse(favoritos);
  }

  function obtenerParametroURL(parametro) {
    var urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(parametro);
  }
});
