import grails.converters.*
import org.curransoft.processingdb.*;
import grails.util.Environment

class BootStrap {
    def init = { servletContext ->
        if(Environment.current == Environment.DEVELOPMENT) {
            /*String filePath = "WEB-INF/data/dbArchive11-04-17-17-02.xml";
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
            }*/
            User fred = new User(login:"fred",password:"test").save()

            Revision pointR1 = new Revision(
                revNum:1,
                name:"Point",
                description:"A two dimensional point class.",
                code:"class Point{ double x; double y; }",
                doc:"A <code>Point</code> is a mutable object with (y,x) cartesian coordinates to double precision",
                isApp:false);

            fred.addToRevisions(pointR1)
         

            Script point = new Script().save()
            fred.addToScripts(point)
            point.addToRevisions(pointR1)
            point.first = point.current=pointR1

            if(!point.save())
                println point.errors
            if(!pointR1.save())
                println pointR1.errors

/*
            Script color = new Script(
                name:"Color",
                description:"A color class.",
                code:"class Color{ int r; int g; int b; }",
                doc:"A <code>Color</code> is a mutable object with integer (red,green,blue) values, each between 0 and 255.",
                isApp:false);

            fred.addToScripts(color).save()

            Script circle = new Script(
                name:"Circle",
                description:"A circle class.",
                code:"class Circle{ Point point; Color color; double radius; }",
                doc:"A <code>Circle</code> is an object with a center point, color and radius.",
                isApp:false);

            fred.addToScripts(circle).save()

            circle.addToDependencies(point).save()
            circle.addToDependencies(color).save()

*/

        }
    }
    def destroy = {
    }
}
