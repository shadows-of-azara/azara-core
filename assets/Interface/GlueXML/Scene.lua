
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
--                1     2  3  4  5    6      7                                                  8                                                       9          10           11         12        13				14
--modelData: { sceneID, x, y, z, o, scale, alpha, [{ enabled[,omni,dirX,dirY,dirZ,ambIntensity[,ambR,ambG,ambB[,dirIntensity[,dirR,dirG,dirB]]]] }], sequence, widthSquish, heightSquish, path [,referenceID] [,cameraModel] }
--[[ DOCUMENTATION:
	sceneID:			number	- on which scene it's supposed to show up
	x:					number	- moves the model left and right  \
	y:					number	- moves the model up and down	   |	if the model doesn't show up at all try moving it around sometimes it will show up | blue white box: wrong path | no texture: texture is set through dbc, needs to be hardcoded | green texture: no texture
	z:					number	- moves the model back and forth  /
	o:					number	- the orientation in which direction the model will face | number in radians | math.pi = 180° | math.pi * 2 = 360° | math.pi / 2 = 90°
	scale:				number	- used to scale the model | 1 = normal size | does not scale particles of flames for example on no camera models, use width/heightSquish for that
	alpha:				number  - opacity of the model | 1 = 100% , 0 = 0%
	light:				table	- table containing light data (look in light documentation for further explanation) | is optional
	sequence:			number	- the animation that should be played after the model is loaded
	widthSquish:		number	- squishes the model on the X axis | 1 = normal
	heightSquish:		number	- squishes the model on the Y axis | 1 = normal
	path:				String  - the path to the model ends with .mdx
	referenceID:		number  - mainly used for making changes while the scene is playing | example:
	
	local m = GetModel(1)	<- GetModel(referenceID) the [1] to use the first model with this referenceID without it it would be a table with all models inside
	if m then
		m = m[1]
		local x,y,z = m:GetPosition()
		m:SetPosition(x-0.1,y,z)				<- move the model -0.1 from it's current position on the x-axis
	end
	
	cameraModel:		String	- if a path to a model is set here, it will be used as the camera
]]
--[[ LIGHT:
	enabled:			number	- appears to be 1 for lit and 0 for unlit
    omni:				number	- ?? (default of 0)
    dirX, dirY, dirZ:	numbers	- vector from the origin to where the light source should face
    ambIntensity:		number	- intensity of the ambient component of the light source
    ambR, ambG, ambB:	numbers	- color of the ambient component of the light source
    dirIntensity:		number	- intensity of the direct component of the light source
    dirR, dirG, dirB:	numbers	- color of the direct component of the light source 
]]
--[[ METHODS:
	GetModelData(referenceID / sceneID, (bool) get-all-scene-models)	table									- gets the model data table out of ModelList (returns a table with all model datas that have the same referenceID) or if bool is true from the scene
	GetModel(referenceID / sceneID, (bool) get-all-scene-models)		table									- gets all models with the same referenceID or the same sceneID (if bool is true)
	SetScene(sceneID)													nil										- sets the current scene to the sceneID given to the function
	GetScene([sceneID])													sceneID, sceneData, models, modeldatas	- gets all information of the current scene [of the sceneID]
	convert_to_16_to_9([x][,y])											x, y 									- returns the x or y (or both) input within the 16:9 resolution loginscene field (useful for mouse positions across resolutions)
	
	some helpful globals:
	ModelList.sceneCount	number	- the count of how many scenes exist
	ModelList.modelCount	number	- the count of how many models exist
]]
--[[ CREDITS:
	Made by Mordred P.H.
	
	Thanks to:
	Soldan - helping me with all the model work
	Chase - finding a method to copy cameras on the fly
	Stoneharry - bringing me to the conclusion that blizzard frames are never fullscreen, so it works with every resolution
	Blizzard - for making it almost impossible to make it work properly
]]
-------------------------------------------------------------------------
--                   1                2
--sceneData: {time_in_seconds, background_path}   --> (index is scene id)

ModelList = {
	loaded = false,									-- safety so anything else happens after loading (leave at 0)
	blend_start_duration = 1,						-- beginning fade animation duration in seconds
	max_scenes = 2,									-- number of scenes you use to shuffle through
	fade_duration = 1,								-- fade animation duration in seconds (to next scene if more than 1 exists)
	current_scene = 1,								-- current scene that gets displayed
	use_random_starting_scene = false,				-- boolean: false = always starts with sceneID 1   ||   true = starts with a random sceneID
	shuffle_scenes_randomly = false,				-- boolean: false = after one scene ends, starts the scene with sceneID + 1   ||   true = randomly shuffles the next sceneID
	login_music_path = false,						-- path to the music / false if no music
	login_ambience_name = false,	-- name in SoundEntries.dbc / false if no ambience
	sceneData = {
		{-1, "Interface/LoginScreen/Background.blp"},
		{-1, {0.7,0.7,0.7,1}}
	},
	
	-- Scene: 1
	{1, 1.600, 1.015, 0.000, 4.237, 0, 0.106, _, 1, 1, 1, "World/Expansion02/doodads/scholazar/waterfalls/sholazarsouthoceanwaterfall-06.m2", _, _},
	
}

-------------------------------------------------------------------------!!!- end of configuration part -!!!------------------------------------------------------------------------------------------
------------------------------------------------------------------!!!!!!!!!!- end of configuration part -!!!!!!!!!!-----------------------------------------------------------------------------------
-----------------------------------------------!!!!!!!!!!!!!!!!!!!- DO NOT CHANGE BELOW HERE, EXCEPT SCENESCRIPTS -!!!!!!!!!!!!!!!!!!!----------------------------------------------------------------
------------------------------------------------------------------!!!!!!!!!!- end of configuration part -!!!!!!!!!!-----------------------------------------------------------------------------------
-------------------------------------------------------------------------!!!- end of configuration part -!!!------------------------------------------------------------------------------------------

local timed_update, blend_timer

function randomScene()
	return (time() % ModelList.max_scenes) + 1
end

-- creates a scene object that gets used internaly
function newScene()
	local s = {parent = CreateFrame("Frame",nil,LoginScene),
				background = ModelList.sceneData[#M+1 or 1][2],
				duration = ModelList.sceneData[#M+1 or 1][1]}
	s.parent:SetSize(LoginScene:GetWidth(), LoginScene:GetHeight())
	s.parent:SetPoint("CENTER")
	s.parent:SetFrameStrata("MEDIUM")
	table.insert(M, s)
	return s
end

-- creates a new model object that gets used internally but also can be altered after loading
function newModel(parent,alpha,light,wSquish,hSquish,camera)
	local mod = CreateFrame("Model",nil,parent)
	
	light = light or {1, 0, 0, -0.707, -0.707, 0.7, 1.0, 1.0, 1.0, 0.8, 1.0, 1.0, 0.8}
	mod:SetModel(camera or "Character/Human/Male/HumanMale.mdx")
	mod:SetSize(LoginScene:GetWidth() / wSquish, LoginScene:GetHeight() / hSquish)
	mod:SetPoint("CENTER")
	mod:SetCamera(1)
	mod:SetLight(unpack(light))
	mod:SetAlpha(alpha)
	
	return mod
end

-- starts the routine for loading all models and scenes
function Generate_M()
	ModelList.loaded = false
	M = {}
	timed_update, blend_timer = 0, 0
	ModelList.sceneCount = #ModelList.sceneData
	
	local counter = 0
	for i=1, ModelList.sceneCount do
		local s = newScene()
		
		for num, m in pairs(ModelList) do
			if type(m)=="table" and num ~= "sceneData" then
				if m[1] == i then
					table.insert(s, num, newModel(s.parent, m[7], m[8], m[10], m[11], m[14]))
					counter = counter + 1
					ModelList.lastModelNum = num
				end
			end
		end
		
		s.parent:Hide()
		if i == ModelList.current_scene then
			if type(s.background)=="table" then
				LoginScreenBackground:SetTexture(s.background[1],s.background[2],s.background[3],s.background[4])
			else
				LoginScreenBackground:SetTexture(s.background)
			end
		end
	end
	ModelList.modelCount = counter
	ModelList.loaded = true
end

------- updating and methods

function LoginScreen_OnLoad(self)
	local width = GlueParent:GetSize()
	
	if ModelList.login_ambience_name then
		PlayGlueAmbience(ModelList.login_ambience_name,5.0)
	end
	
	if ModelList.use_random_starting_scene then
		ModelList.current_scene = randomScene()
	end
	
	-- main frame for displaying and positioning of the whole loginscreen
	LoginScene = CreateFrame("Frame","LoginScene",self)
		LoginScene:SetSize(width, (width/16)*9)
		LoginScene:SetPoint("CENTER", self, "CENTER", 0,0)
		LoginScene:SetFrameStrata("LOW")
	
	-- main background that changes according to the scene
	LoginScreenBackground = LoginScene:CreateTexture("LoginScreenBackground","LOW")
		LoginScreenBackground:SetPoint("TOPRIGHT", LoginScene, "TOPRIGHT", 0, 125)
		LoginScreenBackground:SetPoint("BOTTOMLEFT", LoginScene, "BOTTOMLEFT", -1, -125)
	
	LoginScreenBlackBoarderTOP = self:CreateTexture("LoginScreenBlackBoarderTOP","OVERLAY")
		LoginScreenBlackBoarderTOP:SetTexture(0,0,0,1)
		LoginScreenBlackBoarderTOP:SetHeight(500)
		LoginScreenBlackBoarderTOP:SetPoint("BOTTOMLEFT", LoginScene, "TOPLEFT", 0,0)
		LoginScreenBlackBoarderTOP:SetPoint("BOTTOMRIGHT", LoginScene, "TOPRIGHT", 0,0)
	
	LoginScreenBlackBoarderBOTTOM = self:CreateTexture("LoginScreenBlackBoarderBOTTOM","OVERLAY")
		LoginScreenBlackBoarderBOTTOM:SetTexture(0,0,0,1)
		LoginScreenBlackBoarderBOTTOM:SetHeight(500)
		LoginScreenBlackBoarderBOTTOM:SetPoint("TOPLEFT", LoginScene, "BOTTOMLEFT", 0,0)
		LoginScreenBlackBoarderBOTTOM:SetPoint("TOPRIGHT", LoginScene, "BOTTOMRIGHT", 0,0)
	
	LoginScreenBlend = self:CreateTexture("LoginScreenBlend","OVERLAY")
		LoginScreenBlend:SetTexture(0,0,0,1)
		LoginScreenBlend:SetAllPoints(GlueParent)
	
	Generate_M()
end

function LoginScreen_OnUpdate(self,dt)
	if ModelList.loaded then
		if timed_update then
			if timed_update > 2 then
				for num, m in pairs(ModelList) do
					if type(m)=="table" and num ~= "sceneData" and m[1] <= ModelList.max_scenes then
						local mod = M[m[1]][num]
						mod:SetModel(m[12])
						mod:SetPosition(m[4], m[2], m[3])
						mod:SetFacing(m[5])
						mod:SetModelScale(m[6])
						mod:SetSequence(m[9])
					end
				end
				
				M[ModelList.current_scene].parent:Show()
				blend_start = 0
				timed_update = false
				ModelList.loaded = false
			else
				timed_update = timed_update + 1
			end
		end
	end
	
	if M then
		-- Start blend after the loginscreen loaded to hide the setting up frame
		if blend_start then
			if blend_start < ModelList.blend_start_duration then
				LoginScreenBlend:SetAlpha( 1 - blend_start/ModelList.blend_start_duration )
				blend_start = blend_start + dt
			else
				LoginScreenBlend:SetAlpha(0)
				blend_start = false
			end
		end
		
		local cur = M[ModelList.current_scene]
		if cur.duration ~= -1 then
			-- Scene and blend timer for next scene and blends between the scenes
			if cur.duration < blend_timer then
				if ModelList.max_scenes > 1 then
					local blend = blend_timer - cur.duration
					if blend < ModelList.fade_duration then
						LoginScreenBlend:SetAlpha( 1 - math.abs( 1 - (blend*2 / ModelList.fade_duration) ) )
						
						if blend*2 > ModelList.fade_duration and not nextCset then
							nextC = randomScene()
							if shuffle_scenes_randomly then
								if ModelList.current_scene == nextC then
									nextC = ((ModelList.current_scene+1 > ModelList.max_scenes) and 1) or ModelList.current_scene + 1
								end
							else
								nextC = ((ModelList.current_scene+1 > ModelList.max_scenes) and 1) or ModelList.current_scene + 1
							end
							nextCset = true
							
							local new = M[nextC]
							cur.parent:Hide()
							new.parent:Show()
							if type(new.background)=="table" then
								LoginScreenBackground:SetTexture(new.background[1],new.background[2],new.background[3],new.background[4])
							else
								LoginScreenBackground:SetTexture(new.background)
							end
						end
						
						blend_timer = blend_timer + dt
					else
						ModelList.current_scene = nextC
						nextCset = false
						blend_timer = 0
						LoginScreenBlend:SetAlpha(0)
					end
				else
					blend_timer = 0
				end
			else
				blend_timer = blend_timer + dt
			end
		end
	end
end

function SetScene(sceneID)
	M[ModelList.current_scene].parent:Hide()
	M[sceneID].parent:Show()
	if type(M[sceneID].background)=="table" then
		LoginScreenBackground:SetTexture(M[sceneID].background[1],M[sceneID].background[2],M[sceneID].background[3],M[sceneID].background[4])
	else
		LoginScreenBackground:SetTexture(M[sceneID].background)
	end
	ModelList.current_scene = sceneID
end

function GetScene(sceneID)
	local curScene = ModelList.current_scene
	if sceneID then
		if sceneID <= ModelList.max_scenes and sceneID > 0 then
			curScene = sceneID
		end
	end
	return curScene, ModelList.sceneData[curScene], GetModel(curScene, true), GetModelData(curScene, true)
end

function GetModelData(refID, allSceneModels)
	local data, count = {}, 0
	if allSceneModels then
		for num, m in pairs(ModelList) do
			if type(m)=="table" and num ~= "sceneData" then
				if m[1] == refID then
					table.insert(data, num, m)
					count = count + 1
				end
			end
		end
		return (count > 0 and data) or false
	else
		for num, m in pairs(ModelList) do
			if type(m)=="table" and num ~= "sceneData" then
				if m[13] == refID then
					table.insert(data, num, m)
					count = count + 1
				end
			end
		end
		return (count > 0 and data) or false
	end
end

function GetModel(refID, allSceneModels)
	local data, count = {} ,0
	if allSceneModels then
		for num, m in pairs(ModelList) do
			if type(m)=="table" and num ~= "sceneData" then
				if m[1] == refID then
					table.insert(data, num, M[m[1]][num])
					count = count + 1
				end
			end
		end
		return (count > 0 and data) or false
	else
		local mData = GetModelData(refID)
		if mData then
			for num, m in pairs(mData) do
				table.insert(data, num, M[m[1]][num])
				count = count + 1
			end
			return (count > 0 and data) or false
		else
			return false
		end
	end
end

-- overwrite GlueParent function

function SetGlueScreen(name)
	local newFrame;
	for index, value in pairs(GlueScreenInfo) do
		local frame = _G[value];
		if ( frame ) then
			frame:Hide();
			if ( index == name ) then
				newFrame = frame;
			end
		end
	end
	
	if ( newFrame ) then
		newFrame:Show();
		SetCurrentScreen(name);
		SetCurrentGlueScreenName(name);
		if ( name == "login" ) then
			if login_music_path then
				PlayMusic(login_music_path)
			end
			if login_ambience_name then
				PlayGlueAmbience(login_ambience_name,5.0)
			end
		end
	end
end