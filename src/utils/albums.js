
const mapDBToAlbumSongModel = ({album, songs}) => ({
  id: album.id,
  name: album.name,
  year: album.year,
  songs: songs,
});

module.exports = {mapDBToAlbumSongModel};
