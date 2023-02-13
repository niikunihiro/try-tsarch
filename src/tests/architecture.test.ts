import fs from 'fs'
import * as path from 'path'
import { parse } from 'plantuml-parser'

import 'tsarch/dist/jest'
import { extractGraph } from 'tsarch/dist/src/common/extraction/extractGraph'
import { projectEdges } from 'tsarch/dist/src/common/projection/projectEdges'
import { sliceByFileSuffix } from 'tsarch/dist/src/slices/projection/slicingProjections'
import { exportDiagram } from 'tsarch/dist/src/slices/uml/exportDiagram'

describe('architecture test', () => {
  it('should match uml and dependency', async () => {
    const graph = await extractGraph()
    const mapFunction = sliceByFileSuffix(
      new Map([
        ['controller', 'controllers'],
        ['usecase', 'usecases'],
        ['service', 'services'],
        ['repository', 'repositories'],
      ])
    )
    const reducedGraph = projectEdges(graph, mapFunction)
    const stringDiagram = exportDiagram(reducedGraph)
    const actualDiagram = parse(stringDiagram)
    expect(actualDiagram[0]).toHaveProperty('elements')
    const actual = actualDiagram[0].elements
    expect(actual).toHaveLength(8)

    const umlPath = path.resolve(__dirname, 'architecture.puml')
    const umlDiagram = fs.readFileSync(umlPath, 'utf8')
    const expectedDiagram = parse(umlDiagram)
    expect(expectedDiagram[0]).toHaveProperty('elements')
    const expected = expectedDiagram[0].elements
    expect(expected).toHaveLength(8)

    expect(actual).toEqual(expect.arrayContaining(expected))
  })
})
