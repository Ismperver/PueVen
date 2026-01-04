// docs/.vitepress/config.js
module.exports = {
  base: '/PueVen/',
  title: 'Proyecto PueVen Navigator',
  description: 'Documentación del proyecto Pueven NAvigator',
  themeConfig: {
    nav: [
      { text: 'Inicio', link: '/' },
      { text: 'Arquitectura', link: '/arquitectura' },
      { text: 'Guía de Uso', link: '/guia-de-uso' },
      { text: 'API Reference', link: '/api/README' }
    ],
    sidebar: [
      {
        text: 'Guía',
        items: [
          { text: 'Inicio', link: '/' },
          { text: 'Arquitectura', link: '/arquitectura' },
          { text: 'Guía de Uso', link: '/guia-de-uso' }
        ]
      },
      {
        text: 'API Reference',
        items: [
          { text: 'Modules', link: '/api/modules' },
          { text: 'Classes', link: '/api/classes' },
          { text: 'Functions', link: '/api/functions' }
        ]
      }
    ]
  }
}
