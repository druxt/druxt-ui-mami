// For Jest only. The components ship as source and are compiled by the site's
// own build, so nothing here reaches a consumer.
module.exports = {
  presets: [['@babel/preset-env', { targets: { node: 'current' } }]],
}
