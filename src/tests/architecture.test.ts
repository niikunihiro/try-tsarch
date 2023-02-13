import path from 'path'
import { slicesOfProject } from 'tsarch'

describe('architecture test', () => {
  it('should match uml and dependency', async () => {
    const archtectureUml = path.resolve(__dirname, 'architecture.puml')
    const violations = await slicesOfProject()
      .definedBy('src/(**)/')
      .should()
      .adhereToDiagramInFile(archtectureUml)
      .check()
    expect(violations).toEqual([])
  })
})
