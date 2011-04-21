import grails.converters.*
import org.curransoft.processingdb.Script;
class BootStrap {
    def init = { servletContext ->
        String filePath = "WEB-INF/data/dbArchive11-04-17-17-02.xml";
        def data = servletContext.getResourceAsStream(filePath);
        XML.parse(data,"UTF-8").script.each{
            org.curransoft.processingdb.Script s = new org.curransoft.processingdb.Script(
                name:it.name[0].toString(),
                description:it.description.toString(),
                code:it.code.toString(),
                doc:it.doc.toString(),
                isApp:(it.isApp == true)
            )
            it.dependencies.script.@id.each{
                int id = Integer.parseInt(it.toString())
                s.addToDependencies(Script.get(id));
            }
            s.save(flush:true);
        }
    }
    def destroy = {
    }
}
