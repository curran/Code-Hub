import grails.converters.*
import org.curransoft.processingdb.Script;
class BootStrap {
    def init = { servletContext ->

        String filePath = "WEB-INF/data/dbArchive11-04-17-17-02.xml";
        def res = servletContext.getResourceAsStream(filePath);
        def scripts = XML.parse(res,"UTF-8").script;
        try{
            scripts.each{
                //String name = ;
                println("name = "+it.name[0]);
                //println("description = "+it.description);
                //println("code = "+it.code);
                //println("doc = "+it.doc);
                //println("isApp = "+it.isApp+" boolean: "+(it.isApp == true));
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
                    //println " depends "+id//Integer.parseInt(it.@id.);
                    //println " depends "+Script.get(id).name;
                }
                s.save(flush:true);
                println("errors: ${s.errors}");
            }
        }
        catch(Exception e){
            println("got exception");
            println(e);
        }
    }
    def destroy = {
    }
}
