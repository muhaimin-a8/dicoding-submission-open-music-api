const mapDBToPlaylistModel = ({
// eslint-disable-next-line camelcase
  playlist_id, name, owner,
}) => ({
  id: playlist_id, name, username: owner,
});

module.exports = {mapDBToPlaylistModel};
