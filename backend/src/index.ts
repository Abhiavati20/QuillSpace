import { Hono } from 'hono'
import { sign, verify } from 'hono/jwt'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { createPostInput, signinInput, signupInput, updatePostInput } from 'quillspace_v1'
import { cors } from 'hono/cors'



const prisma = new PrismaClient().$extends(withAccelerate())
const app = new Hono<{
  Bindings: {
    DATABASE_URL: string,
    JWT_SECRET: string
  },
  Variables: {
    userId: string,
    prisma: typeof prisma
  }
}>()

app.use("*", cors())

app.use("*", async (c,next) => {
  const prisma = new PrismaClient({
    datasourceUrl: (c.env.DATABASE_URL),
  }).$extends(withAccelerate())
  c.set("prisma", prisma)
  return await next()
})

app.get('/', (c) => {
  
  return c.text('Hello Hono!');
})

app.post("/api/v1/user/signup", async (c) => {
    
  const prisma = c.get("prisma");

  const body = await c.req.json();
  const { success } = signupInput.safeParse(body);
  
  if (!success) {
    c.status(400);
    return c.json({ message:"Invalid input", status: 400 })
  }
  
  const { email, password, name } = body;
  
  try {
    const alreadyAUser = await prisma.user.findUnique({
      where: {
        email
      }
    })
    if (alreadyAUser) {
      c.status(400)
      return c.json({message: "User Already Exists", status:400})
    }
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password
      }
    })
    const jwt = await sign({ id: user.id }, c.env?.JWT_SECRET);
    c.status(201);
    return c.json({ message:"User signed up successfully!", status:201, user, jwt });
  } catch (error) {
    c.status(500)
    return c.json({message:"Error in signup", status:500})
  }

})



app.post("/api/v1/user/signin", async (c) => {
  const body = await c.req.json();
  
  const { success } = signinInput.safeParse(body);
  
  if (!success) {
    c.status(400);
    c.json({ message: "Invalid Credentials", status: 400 })
  }
  
  const { email, password } = body;
  const prisma = c.get("prisma");
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
        password
      }
    });

    if (!user) {
      c.status(404);
      return c.json({message: "User not found with existing credentials", status:404})
    }
    
    const jwt = await sign({ id: user.id }, c.env?.JWT_SECRET);
    c.status(200);
    return c.json({ message:"User signed in successfully!", status:200, user, jwt });

  } catch (error) {
    c.status(500)
    return c.json({message:"Error in signup", status:500})
  }
})


// adding middleware to authorize below requests
app.use("/api/v1/blog/*", async (c, next) => {
  const prisma = c.get("prisma");
  const jwt_token = c.req.header("Authorization");
  
  if (!jwt_token) {
    c.status(401);
    return c.json({message: "Not Authenticated", status:401})
  }

  const token = jwt_token.split(" ")[1];
  const payload = await verify(token, c.env?.JWT_SECRET);
  if (!payload) {
    c.status(401);
    return c.json({message: "Not Authenticated", status:401})
  }

  c.set("userId", String(payload?.id))
  
  // const user = await prisma.user.findUnique({
  //   where: {
  //     id:String(payload?.id)
  //   }
  // })
  
  // if (!user) {
  //   c.status(401);
  //   return c.json({message: "User Not Found", status:401})
  // }

  await next()
})

app.post("/api/v1/blog", async(c) => {
  const userId = c.get("userId");
  const prisma = new PrismaClient({
    datasourceUrl: (c.env.DATABASE_URL),
  }).$extends(withAccelerate())
  const body = await c.req.json();

  const { success } = await createPostInput.safeParse(body);
  if (!success) {
    c.status(400);
    return c.json({ message:"Invalid blog input", status: 400 })
  }

  const { title, content } = body;
  const blog = await prisma.blog.create({
    data: {
      title: title,
      content: content,
      published:true,
      authorId:userId
    }
  })
  c.status(200)
  return c.json({ message: "Post Created Successfully", status: 201, blog});
})

app.put("/api/v1/blog", async (c) => {
  const userId = c.get("userId");
  const prisma = new PrismaClient({
    datasourceUrl: (c.env.DATABASE_URL),
  }).$extends(withAccelerate())

  try {
    const body = await c.req.json();

    const { success } = updatePostInput.safeParse(body);
    
    if (!success) {
      c.status(400);
      c.json({message:"Invalid update input", status:400})
    }

    const { id, title, content,published } = body;
    const updated_blog = await prisma.blog.update({
      where: {
        id,
        authorId:userId
      },
      data: {
        title,
        content,
        published
      }
    })
    c.status(200)
    return c.json({message:"Blog updated successfully", status:200, updated_blog});
  } catch (error) {
    c.status(500)
    return c.json({message:"Error in updating", status:500})
  }
})

app.get("/api/v1/blog/:id", async(c) => {
  
  const id = c.req.param("id");
  
  const prisma = new PrismaClient({
    datasourceUrl: (c.env.DATABASE_URL),
  }).$extends(withAccelerate())

  try {
    const blog = await prisma.blog.findUnique({
      where: {
        id
      }
    })
    c.status(200);
    return c.json({ blog })
  } catch (error) {
    c.status(500);
    return c.json({ message:"Blog not found", status: 500 })
  }
})

app.get("/api/v1/blogs", async(c) => {
  const prisma = new PrismaClient({
    datasourceUrl: (c.env.DATABASE_URL),
  }).$extends(withAccelerate())

  try {
    const blogs = await prisma.blog.findMany()  
    c.status(200);
    return c.json({ blogs })
  } catch (error) {
    c.status(500)
    return c.json({message:"No Blugs found", status:500})
  }
})

export default app
