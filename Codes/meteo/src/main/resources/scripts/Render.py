#!/usr/bin/python
# -*-coding:utf-8-*-

import sys
import os
import math
import mapnik


class GridExtent:
    def __init__(self, xmin, xmax, ymin, ymax, resoultion):
        self.xmin = xmin
        self.xmax = xmax
        self.ymin = ymin
        self.ymax = ymax
        self.resoultion = resoultion
        self.xsize = int((xmax - xmin) / resoultion)
        self.ysize = int((ymax - ymin) / resoultion)


class RenderFile(object):
    def __init__(self, name):
        self.name = name

    def get_style_config(self, eleName):
        # print fileName
        if eleName == 'v12052':     # 平均气温
            return 'TAV'
        elif eleName == 'v12053':  # *平均气温距平
            return 'TAD'
        elif eleName == 'v13201':  # 降水量
            return 'RRR'
        elif eleName == 'v13202':  # *降水量距平
            return 'RRD'
        elif eleName == 'v13203':  # *降水距平百分率
            return 'RDP'
        elif eleName == 'v14032':  # 日照时数
            return 'SSH'
        elif eleName == 'v14033':  # *日照时数距平
            return 'SSD'
        elif eleName == 'v14034':  # *日照距平百分率
            return 'SDP'
        else:
            return 'TAV'

    def get_mftype(self, input_file):
        if('CGFC' in input_file):
            return 'CGFC'
        else:
            return 'CGRM'

    def render(self, input_file, extent, lyr_style):
        proj4lyr = '+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs'
        county_file = '../datas/county.shp'
        # river_file = '../datas/river.shp'
        # capital_file ='Capital3.json'
        filename = os.path.split(input_file)[1]
        areaCode = os.path.splitext(filename)[0]
        output_file = input_file.split('.')[0] + '.png'
        print areaCode

        # ----------create map---------------------
        m = mapnik.Map(extent.xsize, extent.ysize)
        mapnik.load_map(m, 'cg_config.xml')
        # ----------create layer 1-----------------
        layer = mapnik.Layer('dataraster', proj4lyr)
        # ----------create layer 1 datasource------
        layer.datasource = mapnik.Gdal(file=input_file, band=1, nodata=-999)
        layer.styles.append(lyr_style)
        # ----------append layer 1 to map----------
        m.layers.append(layer)

        # ----------create layer 2-----------------
        layer2 = mapnik.Layer('county', proj4lyr)
        # Create new styles and add the rules.
        s_county = m.find_style('county')
        r_county = s_county.rules[0]
        r_county.filter = mapnik.Filter('[CITY]=' + areaCode)
        m.append_style(areaCode, s_county)
        # ----------create layer 2 datasource------
        layer2.datasource = mapnik.Shapefile(file=county_file)
        layer2.styles.append(areaCode)
        # ----------append layer 2 to map----------
        m.layers.append(layer2)

        # ----------create layer 3-----------------
        layer3 = mapnik.Layer('capital', proj4lyr)
        # Create new styles and add the rules.
        s_capital = m.find_style('capital')
        r_capital = s_capital.rules[0]
        r_capital.filter = mapnik.Filter('[CITY]=' + areaCode)
        m.append_style('symbol', s_capital)
        # ----------create layer 3 datasource------
        layer3.datasource = mapnik.Shapefile(file=county_file)
        layer3.styles.append('symbol')
        # ----------append layer 3 to map----------
        m.layers.append(layer3)

        ll = mapnik.Coord(extent.xmax, extent.ymax)
        tr = mapnik.Coord(extent.xmin, extent.ymin)
        map_bbox = mapnik.Box2d(tr, ll)  # mapnik.Envelope(tr, ll)

        m.zoom_to_box(map_bbox)
        print m.envelope(), m.scale()
        mapnik.render_to_file(m, output_file, 'png')

        return 'true'


if __name__ == '__main__':
    if len(sys.argv) != 8:
        print 'Usage: python filename xmin xmax ymin ymax resoultion element'
        exit(1)

    filename = sys.argv[1]
    xmin = float(sys.argv[2])
    xmax = float(sys.argv[3])
    ymin = float(sys.argv[4])
    ymax = float(sys.argv[5])
    resoultion = float(sys.argv[6])
    element = sys.argv[7]

    # filename = 'D:\\app\\www\\admin2\\350700.img'
    # xmin = 116.99774940457
    # xmax = 119.24774940457
    # ymin = 26.2667113045743
    # ymax = 28.3167113045743
    # resoultion = 0.05

    extent = GridExtent(xmin, xmax, ymin, ymax, resoultion)
    rdf = RenderFile('meteo')
    style = rdf.get_style_config(element)
    print style

    rdf.render(filename, extent, style)
