const mapDBToPlaylistModel = ({
// eslint-disable-next-line camelcase
  playlist_id, name, owner,
}) => ({
  id: playlist_id, name, username: owner,
});

const mapDBToDetailSongOnPlaylistModel = (playlist, songs) => ({
  id: playlist.id,
  name: playlist.name,
  username: playlist.owner,
  songs: {songs},
});

module.exports = {mapDBToPlaylistModel, mapDBToDetailSongOnPlaylistModel};
