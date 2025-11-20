import Link from "../models/linkModel.js"

export const createlink=async(req,res)=>{
    try {
        const {code,targetUrl}=req.body
        if(!(code && targetUrl)){
            return res.status(400).json({message:"Code or targeturl is not present"})
        }
        const existingLink=await Link.findOne({code})
        if(existingLink){
            return res.status(409).json({message:"Code already exists"})
        }

        const link= await Link.create({
            code,
            targetUrl
        })

        if(!link){
            return res.status(500).json({message:"failed while creating a link in DB"})
        }
        return res.status(201).json(link)
    } catch (error) {
        console.log("create link ERROR::",error);
        
    }
}

export const deleteLink=async(req,res)=>{
    try {
        const {code}=req.params
        if(!code){
            return res.status(400).json({message:"Code is not present"})
        }

        const link = await Link.findOneAndDelete({code})
        if(!link){
            return res.status(404).json({message:"link not found"})
        }

        return res.status(200).json({message:"link deleted successfully"})
    } catch (error) {
        console.log("deleteLink ERROR::",error);
        
    }
}

export const getLinkDetails=async(req,res)=>{
    try {
        const {code}=req.params
        if(!code){
            return res.status(400).json({message:"Code is not present"})
        }
        const link=await Link.findOne({code})
        if(!link){
            return res.status(404).json({message:"link not found"})
        }
        return res.status(200).json(link)
    } catch (error) {
        console.log("getLinkDetails ERROR::",error);
        
    }
}

export const getAllLinks=async(req,res)=>{
    try {
        const links=await Link.find({})
        if(!links){
            return res.status(404).json({message:"no links found"})
        }
        return res.status(200).json(links)
    } catch (error) {
        console.log("getAllLinks ERROR::",error);
        
    }
}