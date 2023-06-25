$(document).ready(function() {
  // Evento click para los botones de detalles
  $("#resultados-series").on("click", ".detalles-btn", function(event) {
    event.preventDefault();
    var serieId = $(this).data("serie-id");
    redireccionarADetalles(serieId);
  });

  // Función para redireccionar a la página de detalles
  function redireccionarADetalles(serieId) {
    window.location.href = "peliculas.html?id=" + serieId;
  }

  function mostrarSeries() {
    var seriesIds = [
      'tt4574334', 
      'tt5753856',
      'tt0903747',
      'tt0898266',
      'tt7335184',
      'tt7366338',
      'tt2442560',
      'tt2306299',
      'tt11311302',
      'tt4158110',
      'tt13207736',
      'tt0944947'
    ];

    var apiKey = "9d23dd20";
    var output = "";
    $("#titulo-series").removeClass("d-none");

    $.each(seriesIds, function(index, imdbId) {
      var url = "https://www.omdbapi.com/?apikey=" + apiKey + "&i=" + imdbId;

      $.ajax({
        url: url,
        type: "GET",
        dataType: "json",
        success: function(response) {
          console.log(JSON.stringify(response));
          if (response.Response === "True") {
            var serie = response;
            output += `
              <div class="row" id="series">
                <div class="col-md-4">
                  <div class="text-center">
                    <img src="${serie.Poster}" class="poster">
                    <h5>${serie.Title}</h5>
                    <a onclick="mostrarDetalles('${serie.imdbID}')" class="btn-detalles btn-primary" href="peliculas.html?id=${serie.imdbID}">Detalles</a>
                  </div>
                </div>
              </div>
            `;
            $("#series").html(output);
          } else {
            $("#series").html("<p>No se encontraron series</p>");
          }
        },
        error: function() {
          $("#series").html("<p>Error al obtener las series</p>");
        }
      });
    });
  }

  function buscarSerie() {
    var titulo = $("#inputTitulo").val();
    if (titulo.trim() !== "") {
      var apiKey = "9d23dd20";
      var url = "https://www.omdbapi.com/?apikey=" + apiKey;
      $("#titulo-series").addClass("d-none");

      $.ajax({
        url: url,
        type: "GET",
        dataType: "json",
        data: {
          type: "series",
          s: titulo
        },
        success: function(response) {
          if (response.Response === "True") {
            var series = response.Search;
            var output = "";
            $.each(series, function(index, serie) {
              output += `
                <div class="row" id="resultados-series">
                  <div class="col-md-4">
                    <div class="text-center">
                      <img src="${serie.Poster}" class="poster">
                      <h5>${serie.Title}</h5>
                      <a onclick="mostrarDetalles('${serie.imdbID}')" class="btn-detalles btn-primary" href="peliculas.html?id=${serie.imdbID}">Detalles</a>
                    </div>
                  </div>
                </div>
              `;
            });
            $("#resultados-series").html(output);
          } else {
            $("#titulo-series").removeClass("d-none");
            $("#resultados-series").html("<p>No se encontraron series</p>");
          }
        },
        error: function() {
          $("#titulo-series").removeClass("d-none");
          $("#resultados-series").html("<p>Error al buscar las series</p>");
        }
      });
    } else {
      mostrarSeries();
    }
  }

  $("#btnBuscar").click(function() {
    buscarSerie();
  });

  var favoritos = obtenerFavoritos();

  // Verificar si hay series favoritas almacenadas
  if (favoritos.length > 0) {
    // Generar el contenido HTML para las series favoritas
    var favoritosOutput = "";

    // Recorrer la lista de favoritos y generar el contenido de cada serie
    for (var i = 0; i < favoritos.length; i++) {
      var serieId = favoritos[i];

      // Agregar la serie a la lista de favoritos
      obtenerDetallesSerie(serieId, function(serie) {
        if (serie) {
          favoritosOutput += `
            <div class="favorito">
              <a style="text-decoration: none; color: white;" href="peliculas.html?id=${serie.imdbID}">
                <h3>${serie.Title} ${i + 1}</h3>
              </a>
            </div>
          `;
          // Insertar el contenido de las series favoritas en el contenedor correspondiente
          $("#favoritos-container").html(favoritosOutput);
        }
      });
    }
  } else {
    // Mostrar un mensaje si no hay series favoritas almacenadas
    $("#favoritos-container").html("<p>No tienes series favoritas.</p>");
  }

  function obtenerFavoritos() {
    // Obtener los datos de favoritos almacenados en el almacenamiento local
    var favoritosString = localStorage.getItem("favoritos");
    // Verificar si hay datos almacenados
    if (favoritosString) {
      // Parsear los datos almacenados en formato JSON a un array
      var favoritos = JSON.parse(favoritosString);

      // Devolver el array de favoritos
      return favoritos;
    } else {
      // Si no hay datos almacenados, retornar un array vacío
      return [];
    }
  }

  function obtenerDetallesSerie(serieId, callback) {
    var apiKey = "9d23dd20"; // Reemplaza "TU_API_KEY" con tu propia clave de API
    var serieUrl = "https://www.omdbapi.com/?apikey=" + apiKey + "&i=" + serieId;

    $.ajax({
      url: serieUrl,
      type: "GET",
      dataType: "json",
      success: function(response) {
        if (response.Response === "True") {
          callback(response);
        } else {
          callback(null);
        }
      },
      error: function() {
        callback(null);
      }
    });
  }

  mostrarSeries();
});
