<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0" 
                xmlns:html="http://www.w3.org/TR/REC-html40"
                xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <title>XML Sitemap - mlguy.site</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <style type="text/css">
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 40px 20px;
          }
          
          .container {
            max-width: 1200px;
            margin: 0 auto;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            overflow: hidden;
          }
          
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px;
            text-align: center;
          }
          
          .header h1 {
            font-size: 2.5rem;
            margin-bottom: 10px;
            font-weight: 700;
          }
          
          .header p {
            font-size: 1.1rem;
            opacity: 0.9;
          }
          
          .info {
            background: #f8f9fa;
            padding: 30px 40px;
            border-bottom: 1px solid #e9ecef;
          }
          
          .info h2 {
            color: #495057;
            font-size: 1.3rem;
            margin-bottom: 15px;
          }
          
          .info p {
            color: #6c757d;
            line-height: 1.6;
            margin-bottom: 10px;
          }
          
          .info a {
            color: #667eea;
            text-decoration: none;
            font-weight: 600;
          }
          
          .info a:hover {
            text-decoration: underline;
          }
          
          .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            padding: 30px 40px;
            background: white;
            border-bottom: 1px solid #e9ecef;
          }
          
          .stat-card {
            text-align: center;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 12px;
            color: white;
          }
          
          .stat-card .number {
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 5px;
          }
          
          .stat-card .label {
            font-size: 0.9rem;
            opacity: 0.9;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          
          .url-list {
            padding: 40px;
          }
          
          table {
            width: 100%;
            border-collapse: collapse;
          }
          
          thead {
            background: #f8f9fa;
          }
          
          th {
            padding: 15px;
            text-align: left;
            font-weight: 600;
            color: #495057;
            border-bottom: 2px solid #dee2e6;
            font-size: 0.9rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          
          tbody tr {
            border-bottom: 1px solid #e9ecef;
            transition: background-color 0.2s ease;
          }
          
          tbody tr:hover {
            background-color: #f8f9fa;
          }
          
          td {
            padding: 15px;
            color: #495057;
          }
          
          td a {
            color: #667eea;
            text-decoration: none;
            font-weight: 500;
            word-break: break-all;
          }
          
          td a:hover {
            text-decoration: underline;
          }
          
          .priority-high {
            color: #28a745;
            font-weight: 600;
          }
          
          .priority-medium {
            color: #ffc107;
            font-weight: 600;
          }
          
          .priority-low {
            color: #6c757d;
            font-weight: 600;
          }
          
          .footer {
            text-align: center;
            padding: 30px;
            background: #f8f9fa;
            color: #6c757d;
            font-size: 0.9rem;
          }
          
          @media (max-width: 768px) {
            .header h1 {
              font-size: 1.8rem;
            }
            
            .url-list {
              padding: 20px;
              overflow-x: auto;
            }
            
            table {
              font-size: 0.85rem;
            }
            
            th, td {
              padding: 10px;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🗺️ XML Sitemap</h1>
            <p>mlguy.site</p>
          </div>
          
          <div class="info">
            <h2>What is a Sitemap?</h2>
            <p>This is an XML Sitemap that helps search engines like Google discover and index the pages on this website. It contains a list of all important URLs along with metadata about when they were last updated and how frequently they change.</p>
            <p>Learn more about sitemaps at <a href="https://www.sitemaps.org/" target="_blank">sitemaps.org</a>.</p>
          </div>
          
          <div class="stats">
            <div class="stat-card">
              <div class="number">
                <xsl:value-of select="count(sitemap:urlset/sitemap:url)"/>
              </div>
              <div class="label">Total URLs</div>
            </div>
          </div>
          
          <div class="url-list">
            <table>
              <thead>
                <tr>
                  <th>URL</th>
                  <th>Last Modified</th>
                  <th>Change Frequency</th>
                  <th>Priority</th>
                </tr>
              </thead>
              <tbody>
                <xsl:for-each select="sitemap:urlset/sitemap:url">
                  <tr>
                    <td>
                      <a href="{sitemap:loc}">
                        <xsl:value-of select="sitemap:loc"/>
                      </a>
                    </td>
                    <td>
                      <xsl:value-of select="sitemap:lastmod"/>
                    </td>
                    <td>
                      <xsl:value-of select="sitemap:changefreq"/>
                    </td>
                    <td>
                      <xsl:choose>
                        <xsl:when test="sitemap:priority &gt;= 0.8">
                          <span class="priority-high">
                            <xsl:value-of select="sitemap:priority"/>
                          </span>
                        </xsl:when>
                        <xsl:when test="sitemap:priority &gt;= 0.5">
                          <span class="priority-medium">
                            <xsl:value-of select="sitemap:priority"/>
                          </span>
                        </xsl:when>
                        <xsl:otherwise>
                          <span class="priority-low">
                            <xsl:value-of select="sitemap:priority"/>
                          </span>
                        </xsl:otherwise>
                      </xsl:choose>
                    </td>
                  </tr>
                </xsl:for-each>
              </tbody>
            </table>
          </div>
          
          <div class="footer">
            Generated for mlguy.site • Last updated: <xsl:value-of select="sitemap:urlset/sitemap:url[1]/sitemap:lastmod"/>
          </div>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
